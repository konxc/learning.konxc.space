-- Migration: Align with PLATFORM_ARCHITECTURE_BRIEF.md and NEON_MIGRATION_BRIEF.md
-- Date: 2026-04-03
-- Purpose: 
--   1. Add orgId to enrollment table for multi-tenant isolation
--   2. Normalize user.role to only allow: 'admin', 'bd', 'user'
--   3. Clean up legacy data (mentor/facilitator as platform roles)

-- ============================================================
-- 1. Add orgId column to enrollment table (for multi-tenant isolation)
-- ============================================================
ALTER TABLE "enrollment" ADD COLUMN IF NOT EXISTS "org_id" text REFERENCES "organization"("id");

-- Create index for faster org-based queries
CREATE INDEX IF NOT EXISTS "enrollment_org_id_idx" ON "enrollment"("org_id");

-- ============================================================
-- 2. Normalize user.role - Platform roles should only be: admin, bd, user
-- Per PLATFORM_ARCHITECTURE_BRIEF.md: mentor/facilitator are ORG-LEVEL roles only
-- ============================================================

-- First, check for users with invalid platform roles
DO $$
DECLARE
    invalid_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO invalid_count
    FROM "user"
    WHERE role NOT IN ('admin', 'bd', 'user');
    
    IF invalid_count > 0 THEN
        RAISE NOTICE 'Found % users with invalid platform roles', invalid_count;
    END IF;
END $$;

-- Update users with 'mentor' role to 'user'
-- Note: These users should have their mentor role in organization_member table
UPDATE "user" 
SET role = 'user' 
WHERE role = 'mentor';

-- Update users with 'facilitator' role to 'user'
-- Note: These users should have their facilitator role in organization_member table
UPDATE "user" 
SET role = 'user' 
WHERE role = 'facilitator';

-- Update any other invalid roles to 'user'
UPDATE "user" 
SET role = 'user' 
WHERE role NOT IN ('admin', 'bd', 'user');

-- ============================================================
-- 3. Create helper function to check valid platform roles
-- ============================================================
CREATE OR REPLACE FUNCTION is_valid_platform_role(role TEXT)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN role IN ('admin', 'bd', 'user');
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- ============================================================
-- 4. Add comments for documentation
-- ============================================================
COMMENT ON COLUMN "user"."role" IS 'Platform role: admin, bd, or user. For mentor/facilitator, use organization_member.role';
COMMENT ON COLUMN "organization_member"."role" IS 'Organization role: owner, admin, mentor, facilitator, or member';
COMMENT ON COLUMN "enrollment"."org_id" IS 'Organization ID for multi-tenant isolation (nullable for marketplace enrollments)';
COMMENT ON COLUMN "course"."visibility" IS 'Course visibility: public, internal, draft, or invite_only';

-- ============================================================
-- 5. Backfill enrollment.orgId from course.orgId
-- ============================================================
UPDATE "enrollment" e
SET org_id = c.org_id
FROM "course" c
WHERE e.course_id = c.id
  AND e.org_id IS NULL
  AND c.org_id IS NOT NULL;

-- ============================================================
-- 6. Verify the changes
-- ============================================================
SELECT 'Migration complete. Checking results...' as status;

-- Check user roles
SELECT role, COUNT(*) as count
FROM "user"
GROUP BY role
ORDER BY role;

-- Check enrollment org_id
SELECT 
    COUNT(*) as total_enrollments,
    COUNT(org_id) as enrollments_with_org,
    COUNT(*) - COUNT(org_id) as enrollments_without_org
FROM "enrollment";
