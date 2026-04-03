import { neon } from '@neondatabase/serverless';
import { config } from 'dotenv';

config({ path: '.env' });

if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL not set');

const sql = neon(process.env.DATABASE_URL);

async function migrate() {
  console.log('Adding org_id column to coupon table...');
  try {
    await sql`ALTER TABLE "coupon" ADD COLUMN "org_id" text REFERENCES "organization"("id")`;
    console.log('✅ coupon.org_id added');
  } catch (e: any) {
    if (e.message?.includes('already exists')) {
      console.log('⊘ coupon.org_id already exists');
    } else {
      console.error('❌ Error:', e.message);
    }
  }

  console.log('Adding org_id column to enrollment table...');
  try {
    await sql`ALTER TABLE "enrollment" ADD COLUMN "org_id" text REFERENCES "organization"("id")`;
    console.log('✅ enrollment.org_id added');
  } catch (e: any) {
    if (e.message?.includes('already exists')) {
      console.log('⊘ enrollment.org_id already exists');
    } else {
      console.error('❌ Error:', e.message);
    }
  }

  console.log('\nBackfilling enrollment.org_id from courses...');
  try {
    await sql`
      UPDATE "enrollment" e
      SET org_id = c.org_id
      FROM "course" c
      WHERE e.course_id = c.id
        AND e.org_id IS NULL
        AND c.org_id IS NOT NULL
    `;
    console.log('✅ Enrollment org_id backfilled');
  } catch (e: any) {
    console.error('❌ Error:', e.message);
  }

  console.log('\n✅ Migration complete!');
}

migrate().catch(console.error);