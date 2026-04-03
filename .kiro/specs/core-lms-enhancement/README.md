# Core LMS Enhancement — Spec Summary

> Penyempurnaan dan penambahan fitur Core LMS untuk setiap role dengan fokus pada MVP launch.

**Status:** Ready for Implementation  
**Priority:** 🔥 Critical for MVP  
**Estimasi:** 10-12 hari (Phase 1) dengan 2-3 developer

---

## Quick Links

- [Requirements](./requirements.md) — Detailed requirements untuk setiap role
- [Design](./design.md) — Component architecture, API endpoints, UI/UX patterns
- [Tasks](./tasks.md) — Actionable tasks dengan checklist

---

## What's Included

### Phase 1 — MVP Critical (Week 1-2)

**Task 1: Course Builder Enhancement (Mentor)**

- Course creation wizard (3 steps)
- Module & lesson editor dengan drag-and-drop
- Rich text editor integration
- Video & material upload
- Quiz & assignment builder
- Course preview mode
- Course publish flow

**Task 2: Grading System Enhancement (Mentor)**

- Grading dashboard dengan filter & pagination
- Submission detail & rubric grading
- Bulk grading
- Auto-grading for multiple choice

**Task 3: Student Learning Experience Enhancement**

- Learning dashboard enhancement
- Course learning page layout
- Lesson content display (video, PDF, text)
- Note-taking enhancement
- Quiz taking interface
- Assignment submission
- Lesson navigation & progress

**Task 4: Course Discovery & Enrollment**

- Course catalog enhancement
- Course filter & search
- Course detail page
- Enrollment flow

---

## Key Features

### For Mentors

✅ Easy course creation dengan wizard  
✅ Drag-and-drop module/lesson reordering  
✅ Rich text editor untuk content  
✅ Video embedding (YouTube/Vimeo)  
✅ Quiz & assignment builder  
✅ Rubric-based grading  
✅ Bulk grading tools  
✅ Student progress tracking

### For Students

✅ Intuitive learning dashboard  
✅ Video & PDF viewer  
✅ Note-taking dengan auto-save  
✅ Quiz & assignment submission  
✅ Progress tracking  
✅ Course discovery dengan filter

### For Org Admins

✅ Org dashboard dengan metrics  
✅ Member management  
✅ Course management overview

### For Platform Admins

✅ Platform-wide metrics  
✅ Course approval workflow  
✅ User activity monitoring

---

## Technical Stack

- **Framework:** SvelteKit 2 + Svelte 5 Runes
- **Styling:** Tailwind CSS 4 + Design Tokens
- **Database:** Neon PostgreSQL via Drizzle ORM
- **Rich Text Editor:** Tiptap atau Quill (TBD)
- **Drag-and-Drop:** @dnd-kit/core atau native HTML5 (TBD)
- **Video Player:** YouTube/Vimeo embed
- **PDF Viewer:** PDF.js atau iframe

---

## Implementation Plan

### Week 1

- **Day 1-2:** Task 1.1-1.3 (Course Wizard, Module/Lesson Editor, Rich Text Editor)
- **Day 3-4:** Task 1.4-1.7 (Material Upload, Quiz/Assignment Builder, Preview, Publish)
- **Day 5:** Task 2.1-2.2 (Grading Dashboard, Rubric Grading)

### Week 2

- **Day 1:** Task 2.3-2.4 (Bulk Grading, Auto-grading)
- **Day 2-3:** Task 3.1-3.4 (Learning Dashboard, Layout, Content Display, Notes)
- **Day 4:** Task 3.5-3.7 (Quiz, Assignment, Navigation)
- **Day 5:** Task 4.1-4.4 (Course Catalog, Filter, Detail, Enrollment)

---

## Success Criteria

### Functional

- [ ] Mentor bisa create course dengan wizard dalam <10 menit
- [ ] Mentor bisa grade submission dengan rubric dalam <5 menit
- [ ] Student bisa enroll & start learning dalam <2 menit
- [ ] Student bisa submit quiz & assignment tanpa error
- [ ] Course discovery dengan filter berfungsi dengan baik

### Technical

- [ ] `pnpm run check` 0 errors
- [ ] `pnpm run build` success
- [ ] All routes respect RBAC
- [ ] All components use design tokens
- [ ] Pagination & lazy loading implemented
- [ ] Responsive design (mobile, tablet, desktop)

### Performance

- [ ] Course list load time <2s
- [ ] Lesson content load time <1s
- [ ] Grading dashboard load time <2s
- [ ] Search response time <500ms

---

## Dependencies

### External Libraries (Need to Install)

- [ ] Rich text editor: `pnpm add @tiptap/core @tiptap/starter-kit` atau `pnpm add quill`
- [ ] Drag-and-drop: `pnpm add @dnd-kit/core @dnd-kit/sortable` (optional)
- [ ] PDF viewer: `pnpm add pdfjs-dist` (optional)

### Internal Dependencies

- ✅ Design tokens (`$lib/config/design`)
- ✅ RBAC system (`$lib/server/rbac.ts`)
- ✅ Database schema (all tables exist)
- ✅ Auth system (Lucia v3)

---

## Testing Strategy

### Manual Testing

1. Create dummy org & users (admin, mentor, student)
2. Test mentor create course flow
3. Test student enroll & learn flow
4. Test grading flow
5. Test course discovery

### Automated Testing

1. Unit tests untuk utility functions
2. Integration tests untuk API endpoints
3. E2E tests untuk critical flows (Playwright)

---

## Rollout Plan

### Staging

1. Deploy ke staging environment
2. QA testing dengan test data
3. Fix bugs
4. Performance testing

### Production

1. Backup database
2. Deploy ke production
3. Monitor errors (Sentry)
4. Monitor performance
5. Collect user feedback

---

## Known Limitations

### Phase 1 (MVP)

- ❌ No course templates (manual create only)
- ❌ No bulk content import (manual add only)
- ❌ No advanced analytics (basic metrics only)
- ❌ No AI integration (manual grading only)
- ❌ No peer review (mentor grading only)

### Future Enhancements (Phase 2-3)

- Course templates
- Bulk content import (CSV, JSON)
- Advanced analytics & insights
- AI-powered grading assistance
- Peer review system
- Cohort management enhancement
- Discussion per lesson enhancement

---

## Support & Documentation

### For Developers

- Read [AGENTS.md](../../../AGENTS.md) untuk coding guidelines
- Read [project-context.md](../../../.kiro/steering/project-context.md) untuk project context
- Read [coding-patterns.md](../../../.kiro/steering/coding-patterns.md) untuk coding patterns

### For Users

- User documentation akan dibuat setelah implementasi selesai
- Mentor guide untuk course creation
- Student guide untuk learning experience

---

## Contact

**Spec Owner:** AI Assistant  
**Created:** 2026-04-03  
**Last Updated:** 2026-04-03  
**Status:** Ready for Implementation

---

**Next Step:** Open [tasks.md](./tasks.md) dan mulai implementasi dari Task 1!
