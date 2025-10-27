# Contributing Guide

Terima kasih atas minat Anda untuk berkontribusi pada platform **"Naik Kelas by Koneksi"**!

## 🎓 Tentang Project

Platform edukasi teknologi yang berfokus pada project-based learning, AI-enhanced coding, dan collaborative learning untuk generasi muda Indonesia.

## Getting Started

### Prerequisites

- Node.js 22+
- pnpm 8+
- Git

### Setup Development Environment

```bash
# Clone repository
git clone <repository-url>
cd learning.konxc.space

# Install dependencies
pnpm install

# Setup environment variables
cp .env.example .env
# Edit .env dengan credentials Anda

# Run database migrations
pnpm run db:push

# Start development server
pnpm run dev
```

---

## Development Workflow

### Branch Strategy

- `main` - Production branch (protected)
- `develop` - Development branch
- `feature/*` - Feature branches
- `bugfix/*` - Bug fix branches
- `hotfix/*` - Urgent fixes

### Commit Convention

Gunakan [Conventional Commits](https://www.conventionalcommits.org/)

Format: `<type>(<scope>): <description>`

Types:

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding tests
- `chore`: Maintenance tasks

Examples:

```
feat(auth): add password reset functionality
fix(ui): resolve button alignment issue
docs(readme): update installation instructions
```

---

## Code Style

### ESLint & Prettier

Code akan otomatis di-format dengan Prettier dan di-lint dengan ESLint.

```bash
# Format code
pnpm run format

# Check linting
pnpm run lint
```

### TypeScript

- Gunakan strict mode
- Hindari `any` type
- Berikan proper type annotations

### Svelte

- Gunakan Svelte 5 runes (`$state`, `$props`, `$derived`)
- Use TypeScript untuk type safety
- Ikuti component naming convention

---

## Testing

### Running Tests

```bash
# Unit tests (to be implemented)
pnpm test

# E2E tests
pnpm run test:e2e

# Watch mode
pnpm run test:watch
```

### Test Coverage

Target coverage: 80%+

---

## Pull Request Process

1. Fork repository
2. Buat branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'feat: add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open Pull Request

### PR Checklist

- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex logic
- [ ] Documentation updated
- [ ] No new warnings/errors
- [ ] Tests pass locally
- [ ] Linting passes

---

## Documentation

### Updating Documentation

- Update `CHANGELOG.md` untuk setiap perubahan
- Update `PROGRESS.md` untuk task tracking
- Update `ROADMAP.md` jika ada perubahan rencana
- Add code comments untuk complex logic

### Writing Style

- Gunakan bahasa Indonesia untuk dokumentasi
- Clear dan concise
- Include examples
- Update secara berkala

---

## Questions?

Jika ada pertanyaan:

- Open issue di GitHub
- Check existing documentation
- Reach out to maintainers

---

**Terima kasih atas kontribusi Anda! 🙏**
