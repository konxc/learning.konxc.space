# TODO System Guide

Dokumen ini menjelaskan sistem TODO yang digunakan di project ini dan cara menggunakannya dengan efektif.

**Last Updated**: 2025-10-26

---

## Pengantar: Multiple TODO Systems

Project ini menggunakan **DUA** sistem TODO yang saling melengkapi:

### 1. TODO.md (File-based)

- **Fungsi**: Quick reference personal
- **Lokasi**: `TODO.md` di root project
- **Scope**: Task harian yang cepat
- **Maintenance**: Manual

### 2. AI TODO System (Dynamic)

- **Fungsi**: Structured tracking dengan status
- **Lokasi**: Managed oleh AI assistant via `todo_write` tool
- **Scope**: Task tracking yang lebih detail
- **Maintenance**: Otomatis via AI

---

## 1. TODO.md - Quick Reference

### Fungsi Utama

`TODO.md` adalah file sederhana untuk:

- ✅ **Quick capture** - Menangkap task dengan cepat saat sedang coding
- ✅ **Personal notes** - Catatan pribadi yang belum formal
- ✅ **Reminders** - Pengingat task urgent
- ✅ **Scratch pad** - Temporary notes sebelum di-refine

### Format Penggunaan

```markdown
# TODO List - Quick Reference

## Current Tasks

### [urgent] - Priority Tasks

- [ ] Fix critical bug di timeline mobile
- [ ] Update API documentation

### Backlog

- [ ] Implement dark mode
- [ ] Add animation transitions

### Completed ✅

- [x] Refactor homepage to modular structure
- [x] Update security documentation
```

### Kapan Menggunakan TODO.md?

**Gunakan untuk:**

- Task yang muncul saat coding (capture cepat)
- Personal reminders
- Brainstorm items yang belum jelas
- Temporary notes

**Jangan gunakan untuk:**

- Project-wide tracking
- Complex task dependencies
- Status tracking yang detail
- Team collaboration

### Best Practices

```markdown
# Good

- [ ] Implement user profile page dengan type safety
- [urgent] Fix form validation error
- [blocked: waiting API] Integrate payment gateway

# Avoid

- perbaiki bug ← Terlalu vague
- coding ← Not actionable
```

---

## 2. AI TODO System - Structured Tracking

### Fungsi Utama

AI TODO System menggunakan tool `todo_write` untuk:

- ✅ **Structured status** - pending, in_progress, completed
- ✅ **Team visibility** - Bisa diakses semua member
- ✅ **Progress tracking** - Detail status per task
- ✅ **Dependencies** - Link antar tasks
- ✅ **Automatic updates** - Via AI assistant

### Cara Menggunakan

AI assistant akan update TODO system secara otomatis saat:

- Task baru dimulai
- Task selesai
- Progress update
- Dependencies identified

**Contoh Task Management:**

```typescript
// AI akan create ini saat ada task baru
{
  id: 'implement-user-profile',
  status: 'in_progress',
  content: 'Implement user profile page dengan form update'
}

// Auto-update saat selesai
{
  id: 'implement-user-profile',
  status: 'completed',
  content: 'Implement user profile page dengan form update'
}
```

### Status Types

1. **pending** - Belum dimulai
2. **in_progress** - Sedang dikerjakan
3. **completed** - Selesai
4. **cancelled** - Dibatalkan

---

## Perbandingan Sistem TODO

| Feature             | TODO.md             | AI TODO System                       |
| ------------------- | ------------------- | ------------------------------------ |
| **Speed**           | ⚡ Very fast        | 🐢 Structured                        |
| **Capture**         | ✅ Instant          | ✅ Detailed                          |
| **Status**          | Manual (checkboxes) | Auto (pending→in_progress→completed) |
| **Team visibility** | Via Git             | Via AI context                       |
| **Dependencies**    | Manual notes        | Structured links                     |
| **Best for**        | Quick notes         | Project tracking                     |

---

## Workflow Recommended

### Scenario 1: Quick Task Capture

**Step 1**: Capture ke TODO.md

```markdown
- [ ] Implement dark mode toggle
```

**Step 2**: Saat mulai development

```
AI: Akan create structured TODO
{
  id: 'implement-dark-mode',
  status: 'in_progress',
  content: 'Implement dark mode toggle dengan preference storage'
}
```

**Step 3**: Selesai

```
AI: Auto-update
{
  id: 'implement-dark-mode',
  status: 'completed',
  ...
}
```

**Step 4**: Update TODO.md

```markdown
- [x] Implement dark mode toggle - **COMPLETED**
```

### Scenario 2: Complex Feature

**Step 1**: Mulai di AI TODO System

```
AI akan create multiple tasks:
- Feature proposal → in_progress
- Component creation → pending
- API integration → pending
- Testing → pending
```

**Step 2**: Track progress

```
AI auto-update saat task selesai:
- Component creation → completed
- API integration → in_progress
```

**Step 3**: Summary di TODO.md

```markdown
- [x] Feature: User Profile
  - [x] Design components
  - [x] Create API endpoints
  - [ ] Testing
```

---

## Tips Effective TODO Management

### ✅ DO

1. **Use TODO.md for speed**
   - Quick capture saat coding
   - Brainstorm notes
   - Personal reminders

2. **Use AI TODO for structure**
   - Complex features
   - Multi-step tasks
   - Team tracking

3. **Regular cleanup**

   ```bash
   # Pastikan TODO.md tidak terlalu panjang
   # Move completed tasks ke changelog
   # Archive old tasks
   ```

4. **Be specific**

   ```markdown
   # ❌ Bad

   - Fix bug

   # ✅ Good

   - Fix bug: Timeline items overlap di mobile (< 768px)
   ```

5. **Link documents**
   ```markdown
   - [ ] Implement feature X (see docs/ROADMAP.md #123)
   ```

### ❌ DON'T

1. **Don't duplicate**
   - Jangan duplicate TODO antara TODO.md dan AI system
   - Pilih salah satu

2. **Don't forget to update**
   - Clean up completed tasks
   - Archive old items

3. **Don't be too granular**

   ```markdown
   # ❌ Too granular

   - [ ] Create component file
   - [ ] Add props interface
   - [ ] Write CSS
   - [ ] Test

   # ✅ Better

   - [ ] Create Button component dengan props dan styling
   ```

---

## Integration dengan Tools Lain

### VS Code

Install extension:

```bash
# Todo Tree extension
code --install-extension Gruntfuggly.todo-tree
```

Mark comment dengan TODO:

```typescript
// TODO: Add error handling
// FIXME: Memory leak issue
// HACK: Temporary solution
```

### GitHub Issues

Link TODO dengan Issues:

```markdown
- [ ] Implement #123 - User authentication
- [ ] Fix #156 - Timeline mobile bug
```

---

## Migration dari TODO.md ke AI System

Jika ingin migrate TODO.md ke AI system:

**Before (TODO.md):**

```markdown
- [ ] Implement user profile
- [ ] Add dark mode
- [ ] Fix login bug
```

**After (via AI):**

```javascript
todos = [
	{ id: 'profile', status: 'pending', content: 'Implement user profile' },
	{ id: 'dark-mode', status: 'pending', content: 'Add dark mode' },
	{ id: 'login-bug', status: 'in_progress', content: 'Fix login bug' }
];
```

**Auto-convert by AI:**

```
AI assistant akan membaca TODO.md dan create structured todos
```

---

## Example: Complete Workflow

### Monday Morning

**1. Review TODO.md**

```markdown
- [ ] Fix timeline bug
- [ ] Add footer component
```

**2. Start task (AI auto-create)**

```
AI: { id: 'timeline-bug', status: 'in_progress' }
```

**3. Capture new ideas**

```markdown
# Add to TODO.md

- [ ] Improve performance (lazy loading)
```

**4. End of day**

```
AI auto-update completed tasks
TODO.md cleanup completed items
```

---

## Summary

| Use Case                    | Use This                          |
| --------------------------- | --------------------------------- |
| Quick capture saat coding   | TODO.md                           |
| Complex multi-step features | AI TODO System                    |
| Team-wide tracking          | AI TODO System → docs/PROGRESS.md |
| Personal reminders          | TODO.md                           |
| Brainstorm session          | TODO.md                           |
| Sprint planning             | AI TODO System                    |

**Remember**:

- TODO.md = Speed & convenience
- AI System = Structure & collaboration
- docs/PROGRESS.md = Historical record

---

**Last Updated**: 2025-10-26
