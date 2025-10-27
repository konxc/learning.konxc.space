# Changelog

All notable changes to learning.konxc.space project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

### Changed

- Fixed ESLint configuration to properly handle Svelte files
- Improved database schema synchronization

---

## [0.0.1] - 2025-01-23

### Added

- Initial project setup with SvelteKit 2.x
- Authentication system with Lucia v3
  - Login functionality
  - Register functionality
  - Logout functionality
  - Session management
- Database schema setup with Drizzle ORM
  - User table with id, username, password_hash, age
  - Session table with foreign key to user
- i18n support with Paraglide (inlang)
  - Indonesian (id)
  - English (en)
  - Japanese (jp)
- UI framework: Tailwind CSS 4
- Development tools:
  - ESLint configuration
  - Prettier formatting
  - TypeScript setup

### Fixed

- Fixed closing script tag errors (`<\/script>` -> `</script>`)
- Fixed meta.json 404 error by creating static file
- Fixed GitHub Pages deployment workflow
- Fixed vite-plugin-devtools-json configuration
- Fixed ESLint parsing errors for Svelte files
- Removed unused imports (page, goto) in paraglide demo

### Changed

- Updated ESLint config to ignore Svelte files (handled by Svelte plugin)
- Simplified deployment workflow
- Improved error handling in authentication flow

### Documentation

- Created documentation folder structure
- Added PROGRESS.md for tracking development progress
- Added ROADMAP.md for planning future development
- Added CHANGELOG.md for version history

---

## Notes

### Known Issues

- None currently reported

### Future Improvements

- Add comprehensive error handling
- Implement protected routes middleware
- Add loading states and UI feedback
- User dashboard and profile management

---

**Project started**: 2025-01-23  
**Current version**: 0.0.1
