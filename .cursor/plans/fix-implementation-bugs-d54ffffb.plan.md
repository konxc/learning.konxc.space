<!-- d54ffffb-dbf1-4c4a-8190-f614aa6b67e2 2391289d-6773-4ca1-b5ba-e848fe076644 -->
# Refactor Authentication URLs to Best Practice

Implementasi URL best practice untuk authentication dengan structure yang clean dan semantic.

## Current State

- ❌ `/demo/lucia/login` - Tidak best practice (mengandung library name)
- ✅ `/auth/register` - Sudah ada dan baik
- ❌ Semua redirect masih ke `/demo/lucia/login`

## Target State

- ✅ `/auth/signin` - Login page dengan form
- ✅ `/auth/signup` - Register page (rename dari register)
- ✅ Semua redirect update ke `/auth/signin`

## Implementation Plan

### Step 1: Move Login Route

- Move `src/routes/demo/lucia/login` → `src/routes/auth/signin`
- Update `+page.server.ts` untuk handle action login
- Update `+page.svelte` untuk UI

### Step 2: Rename Register Route (Optional)

- Rename `src/routes/auth/register` → `src/routes/auth/signup`
- Update internal references

### Step 3: Update All Redirect References

Update redirect dari `/demo/lucia/login` ke `/auth/signin` di:

- `src/routes/onboarding/+page.server.ts`
- `src/routes/marketplace/[id]/checkout/+page.server.ts`
- `src/routes/marketplace/[id]/+page.svelte`
- `src/lib/server/middleware.ts`
- `src/routes/dashboard/+layout.server.ts`
- `src/hooks.server.ts`

### Step 4: Update Links in UI

- `src/routes/auth/signup/+page.svelte` - Update login link
- `src/routes/marketplace/[id]/+page.svelte` - Update login link

## URL Structure Comparison

### Before

```
❌ /demo/lucia/login
✅ /auth/register
❌ /demo/lucia?/logout
```

### After  

```
✅ /auth/signin
✅ /auth/signup  
✅ /auth/logout (future)
```

## Files to Modify

- Move: `src/routes/demo/lucia/login` → `src/routes/auth/signin/`
- Update: `src/routes/auth/signup/+page.svelte` (update login link)
- Update: All server files with redirect references
- Update: `src/hooks.server.ts` skip list

## Benefits

- Clean URL structure
- Semantic naming
- Consistent with auth namespace
- Remove library-specific paths

### To-dos

- [ ] Move /demo/lucia/login ke /auth/signin
- [ ] Rename /auth/register ke /auth/signup
- [ ] Update semua redirect dari /demo/lucia/login ke /auth/signin
- [ ] Update semua link di UI ke /auth/signin
- [ ] Update hooks.server.ts untuk skip /auth/signin