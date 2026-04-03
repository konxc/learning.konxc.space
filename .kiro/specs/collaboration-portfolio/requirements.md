# Spec: Collaboration & Portfolio

## Overview

Fitur kolaborasi dan portfolio untuk mendukung project-based learning — student bisa showcase project mereka, melakukan peer review, dan berkolaborasi dalam project spaces.

## Requirements

### R1 — Portfolio Showcase

- R1.1: Halaman `/app/portfolio` — student bisa tambah project dengan judul, deskripsi, URL, screenshot, dan tags
- R1.2: Portfolio publik di `/portfolio/[username]` — bisa diakses tanpa login
- R1.3: Project bisa di-link ke course yang diselesaikan (certificate)
- R1.4: Filter portfolio by track (Technical, Business, Hybrid)

### R2 — Peer Review

- R2.1: Student bisa submit project untuk peer review setelah lesson selesai
- R2.2: Sistem assign reviewer secara random dari cohort yang sama
- R2.3: Reviewer mengisi rubrik penilaian (1-5 per kriteria)
- R2.4: Feedback peer review tampil di halaman submission student
- R2.5: Mentor bisa override peer review score

### R3 — Project Spaces

- R3.1: Setiap cohort punya project space (discussion board khusus project)
- R3.2: Student bisa post update progress project mereka
- R3.3: Mentor dan facilitator bisa comment dan give feedback
- R3.4: File attachment support (image, PDF, max 10MB)

## Technical Constraints

- Portfolio table baru: `userPortfolio` (id, userId, title, description, url, screenshotUrl, tags, courseId, track, isPublic, createdAt)
- Peer review table: `peerReview` (id, submissionId, reviewerId, scores JSON, feedback, createdAt)
- Project space: extend tabel `discussion` yang sudah ada dengan type = 'project_update'
- RBAC: portfolio publik tidak perlu auth, peer review hanya dalam cohort yang sama

## Acceptance Criteria

- [ ] Student bisa tambah dan edit portfolio project
- [ ] Portfolio publik bisa diakses tanpa login
- [ ] Peer review assignment berfungsi dalam cohort
- [ ] Project space discussion berfungsi per cohort
- [ ] pnpm run check 0 errors
