# Requirements Document: Organization Management

## Introduction

Fitur ini memungkinkan pengguna untuk membuat, mengelola, dan bergabung dengan organisasi di platform Naik Kelas. Organisasi adalah unit multi-tenant mandiri — setiap org memiliki member, kursus, dan pengaturan sendiri yang terisolasi dari org lain.

Arsitektur role yang berlaku:

- `user.role` hanya berisi platform roles: `admin | bd | user`
- `mentor` dan `facilitator` adalah org-level roles, bukan platform roles
- Org roles: `owner | admin | mentor | facilitator | member`
- Semua pengecekan akses fitur org menggunakan `hasOrgPermission()` dari `src/lib/server/rbac.ts`
- Setiap query yang menyentuh data org wajib difilter by `orgId`

## Glossary

- **Organization**: Unit tenant mandiri yang memiliki kursus, member, dan pengaturan sendiri
- **Org_Member**: Record keanggotaan yang menghubungkan `user` dengan `organization`, menyimpan `role` org-level
- **Org_Owner**: Member dengan role `owner` — pemilik org, dapat menghapus org dan mengelola billing
- **Org_Admin**: Member dengan role `admin` — dapat mengelola member, invite, dan pengaturan org
- **Org_Mentor**: Member dengan role `mentor` — dapat membuat dan mengelola kursus dalam org
- **Org_Facilitator**: Member dengan role `facilitator` — dapat mengelola cohort dan memonitor progress student
- **Org_Member_Role**: Member dengan role `member` — student dalam org, dapat mengikuti kursus
- **Invitation**: Record di tabel `organizationInvitation` berisi token unik untuk mengundang user bergabung ke org
- **Slug**: Identifier URL-safe yang di-generate dari nama org, harus unik di seluruh platform
- **RBAC**: Role-Based Access Control — diimplementasikan via `hasOrgPermission()` di `src/lib/server/rbac.ts`
- **OrgId**: Primary key org yang wajib disertakan di setiap query data org untuk isolasi tenant

## Requirements

### Requirement 1: Organization Creation

**User Story:** As a user, I want to create a new organization, so that I can manage my team, courses, and members in an isolated workspace.

#### Acceptance Criteria

1. WHEN a user submits the organization creation form with a valid name, THE System SHALL create a new organization record and assign the creating user as `owner` via an `Org_Member` record.
2. WHEN an organization name is submitted, THE System SHALL auto-generate a URL-safe slug from the name.
3. WHEN a slug is generated, THE System SHALL verify the slug is unique across all organizations before saving.
4. IF a generated slug already exists, THEN THE System SHALL append a numeric suffix to produce a unique slug.
5. WHEN a user uploads a logo during org creation, THE System SHALL accept image files up to 500KB and store the result in `organization.logoUrl`.
6. IF an uploaded logo file exceeds 500KB, THEN THE System SHALL return a validation error and reject the upload.
7. THE Onboarding_Wizard SHALL present org creation in three sequential steps: (1) Basic Info — name, description, logo; (2) Invite Members — email inputs; (3) Confirmation.
8. WHEN the user completes step 3 of the wizard, THE System SHALL redirect the user to the newly created org dashboard.

---

### Requirement 2: Member Management

**User Story:** As an Org_Owner or Org_Admin, I want to manage organization members, so that I can control who has access and what they can do within the organization.

#### Acceptance Criteria

1. WHEN an Org_Owner or Org_Admin views the members page, THE System SHALL display all `Org_Member` records for that organization filtered by `orgId`, including each member's role, join date, and last active timestamp.
2. WHEN an Org_Owner or Org_Admin invites a user by email, THE System SHALL generate a unique invitation token, create an `organizationInvitation` record, and send an in-app notification to the invited user if they already have an account.
3. WHEN an Org_Owner or Org_Admin changes a member's role, THE System SHALL update `organization_member.role` to one of the valid org roles: `owner | admin | mentor | facilitator | member`.
4. IF a role change request contains a value outside the valid org roles, THEN THE System SHALL reject the request and return a validation error.
5. WHEN an Org_Owner or Org_Admin removes a member, THE System SHALL delete the corresponding `Org_Member` record after the user confirms the action.
6. WHEN an Org_Owner or Org_Admin views the members page, THE System SHALL display all pending invitations for that organization alongside the active members list.
7. WHEN an Org_Owner or Org_Admin cancels a pending invitation, THE System SHALL delete the `organizationInvitation` record and invalidate the associated token.
8. THE System SHALL use `hasOrgPermission(orgRole, 'member:create')` to authorize all invite and role-change actions — platform `user.role` SHALL NOT be used for this check.

---

### Requirement 3: Invitation Acceptance Flow

**User Story:** As an invited user, I want to accept an organization invitation via a link, so that I can join the organization and access its resources.

#### Acceptance Criteria

1. WHEN a user visits the invitation acceptance route with a valid token, THE System SHALL look up the `organizationInvitation` record by token filtered by `orgId`.
2. IF the invitation token does not exist or has already been used, THEN THE System SHALL return an error page with a descriptive message.
3. IF the invitation token has expired, THEN THE System SHALL return an error page indicating the invitation has expired.
4. WHEN a logged-in user accepts a valid invitation, THE System SHALL create an `Org_Member` record with the role specified in the invitation and mark the invitation as accepted.
5. WHEN an unauthenticated user visits an invitation link, THE System SHALL redirect the user to the login page and preserve the invitation token in the redirect URL so acceptance can complete after login.
6. WHEN an invitation is successfully accepted, THE System SHALL redirect the user to the org dashboard.
7. FOR ALL valid invitation tokens, the sequence of: generate token → store invitation → user visits accept route → membership created SHALL result in exactly one `Org_Member` record for that user and org combination.

---

### Requirement 4: Organization Settings

**User Story:** As an Org_Owner or Org_Admin, I want to update organization settings, so that I can keep the org's profile and branding current.

#### Acceptance Criteria

1. WHEN an Org_Owner or Org_Admin submits updated org settings, THE System SHALL update the `organization` record fields: name, slug, description, and `logoUrl`.
2. IF an updated slug conflicts with an existing org slug, THEN THE System SHALL reject the update and return a validation error.
3. WHEN an Org_Owner or Org_Admin updates the org logo, THE System SHALL enforce the 500KB file size limit and store the result in `organization.logoUrl`.
4. THE System SHALL use `hasOrgPermission(orgRole, 'org:update')` to authorize all settings changes.
5. WHILE an org settings update is in progress, THE System SHALL prevent concurrent conflicting updates to the same org record.

---

### Requirement 5: Organization Analytics

**User Story:** As an Org_Owner, Org_Admin, or Org_Mentor, I want to view analytics for my organization, so that I can monitor course performance and member engagement.

#### Acceptance Criteria

1. WHEN an authorized member views the analytics page, THE System SHALL display total enrollment count per course, filtered by `orgId`.
2. WHEN an authorized member views the analytics page, THE System SHALL display member activity — the count of members who have had session activity within the last 30 days, filtered by `orgId`.
3. WHEN an authorized member views the analytics page, THE System SHALL display course completion rate per course within the org.
4. THE System SHALL use `hasOrgPermission(orgRole, 'analytics:view')` to authorize access to the analytics page.
5. IF a user without `analytics:view` permission attempts to access the analytics page, THEN THE System SHALL redirect the user to the org overview page.

---

### Requirement 6: Workspace Switcher

**User Story:** As a user who belongs to multiple organizations, I want a workspace switcher in the sidebar, so that I can navigate between my personal workspace and org contexts without a full page reload.

#### Acceptance Criteria

1. WHEN a user opens the workspace switcher, THE System SHALL display all organizations the user is a member of, including each org's logo and name.
2. WHEN a user selects an organization from the switcher, THE System SHALL update the active workspace context and render the org-appropriate navigation without a full page reload.
3. WHILE a user is in an org context, THE System SHALL display a visual indicator in the sidebar header distinguishing the org workspace from the personal workspace.
4. WHEN a user switches workspace, THE System SHALL load the org dashboard for the selected org.

---

## Technical Constraints

- Routes: `src/routes/(dashboard)/app/organizations/` (existing)
- Invitation acceptance route: `src/routes/org/invite/+page.server.ts`
- Tables: `organization`, `organizationMember`, `organizationInvitation`
- RBAC: ALL org permission checks MUST use `hasOrgPermission()` from `src/lib/server/rbac.ts` — never check `user.role` for org features
- Org roles in use: `owner | admin | mentor | facilitator | member` — `creator` is NOT a valid org role
- Platform roles (`user.role`): `admin | bd | user` — `mentor` and `facilitator` are NOT platform roles
- Invitation token: generate UUID, store in `organizationInvitation.token`
- Logo upload: base64 stored in `organization.logoUrl`, max 500KB
- Data isolation: every query touching org data MUST include a `where orgId = :orgId` filter

---

## Correctness Properties

These properties capture invariants and round-trip behaviors that should be verified through property-based testing.

### P1 — Slug Uniqueness Invariant

For any set of organizations in the database, no two organizations SHALL share the same slug. This invariant must hold after every create and update operation.

```
∀ org_a, org_b ∈ organizations: org_a.id ≠ org_b.id → org_a.slug ≠ org_b.slug
```

### P2 — Invitation Token Round-Trip

For any valid invitation flow, the sequence generate → store → accept SHALL produce exactly one `Org_Member` record and mark the invitation as used. Accepting the same token a second time SHALL fail.

```
accept(accept(token)) → error on second call
```

### P3 — Org Role Validity Invariant

For any `Org_Member` record, `organization_member.role` SHALL always be one of `{ owner, admin, mentor, facilitator, member }`. No other value is valid. This invariant must hold after every role assignment or change.

```
∀ m ∈ organization_member: m.role ∈ { 'owner', 'admin', 'mentor', 'facilitator', 'member' }
```

### P4 — Data Isolation Invariant

For any query returning org data (members, courses, invitations, analytics), the result set SHALL contain only records where `orgId` matches the requested organization. No records from other organizations SHALL appear in the result.

```
∀ result ∈ query(orgId): result.orgId = orgId
```

### P5 — Permission Check Consistency

For any org action, if `hasOrgPermission(role, permission)` returns `false`, the server action SHALL reject the request with a 403 response. The permission check result and the server action outcome SHALL always agree — there SHALL be no case where the check passes but the action is blocked, or the check fails but the action succeeds.

```
hasOrgPermission(role, p) = false → server_action(role, p) = 403
hasOrgPermission(role, p) = true  → server_action(role, p) ≠ 403
```

### P6 — Analytics OrgId Filter Invariant (Metamorphic)

When a new enrollment is added to org A, the enrollment count returned by the analytics query for org A SHALL increase by exactly 1, and the enrollment count for any other org SHALL remain unchanged.

```
count_after(orgA) = count_before(orgA) + 1
count_after(orgB) = count_before(orgB)  ∀ orgB ≠ orgA
```
