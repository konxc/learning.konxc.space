# AI Coding Assistant Guide

Panduan lengkap untuk bekerja efektif dengan AI coding assistant (seperti Cursor AI, GitHub Copilot, atau Claude) dalam pengembangan platform **"Naik Kelas by Koneksi"**.

**Last Updated**: 2025-10-26

---

## Quick Reference

### Prompt Structure Template

```markdown
CONTEXT:

- Project: Naik Kelas learning platform
- Tech Stack: SvelteKit 5 + TypeScript + Tailwind CSS 4
- Pattern: Modular components approach

TASK:
[Describe what you want to accomplish]

REQUIREMENTS:

- [ ] Requirement 1
- [ ] Requirement 2
- [ ] Requirement 3

CONSTRAINTS:

- Must follow existing code patterns
- Use TypeScript interfaces
- Responsive design required
- No deprecated APIs

REFERENCES:

- Similar implementation: src/lib/components/FeatureCard.svelte
- Design reference: /prototype/v1
```

---

## Effective Prompts by Use Case

### 1. Component Creation

**Prompt Template:**

```
Saya ingin membuat [ComponentName] di [path] dengan:

Props Interface:
interface Props {
  [prop1]: [type];
  [prop2]: [type];
}

Requirements:
1. [Functionality requirement 1]
2. [Functionality requirement 2]
3. [Styling requirement]

Follow patterns from:
- [Similar component reference]
- [Design reference]

Keluaran yang diharapkan:
- [Component file]
- [TypeScript interface]
- [Styling dengan scoped CSS]
```

**Example:**

```
Saya ingin membuat Button component di src/lib/components/Button.svelte dengan:

Props Interface:
interface Props {
  label: string;
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
}

Requirements:
1. Support multiple variants (primary, secondary, danger)
2. Support multiple sizes
3. Proper hover and focus states
4. Accessible (keyboard navigation, ARIA labels)

Follow patterns from:
- src/lib/components/RegistrationForm.svelte (button styling)
- Gradient colors dari app.css

Keluaran: Button.svelte dengan TypeScript interface dan scoped CSS
```

### 2. Bug Fixing

**Prompt Template:**

```
Ada bug di [location]:

SYMPTOM:
  [What's broken and how]

STEPS TO REPRODUCE:
  1. Go to [...]
  2. Click on [...]
  3. See error

EXPECTED BEHAVIOR:
  [What should happen]

ACTUAL BEHAVIOR:
  [What actually happens]

ENVIRONMENT:
  - Browser: [...]
  - Screen size: [...]
  - OS: [...]

SUGGESTED FIX:
  [Your hypothesis, if any]

Keluaran yang diharapkan:
1. Root cause analysis
2. Fix implementation
3. Prevention strategies
```

**Example:**

```
Ada bug di TimelineItem component:

SYMPTOM:
  Timeline items tidak positioning dengan benar di mobile view

STEPS TO REPRODUCE:
  1. Buka http://localhost:5173/
  2. Scroll ke Program section
  3. Resize browser ke width < 768px
  4. See: Items overlap dan tidak readable

EXPECTED BEHAVIOR:
  Timeline items should align ke kiri dengan proper spacing

ACTUAL BEHAVIOR:
  Items overlap dengan timeline vertical line

ENVIRONMENT:
  - Browser: Chrome 118
  - Screen size: Mobile (375px)
  - OS: macOS

Current code di TimelineItem.svelte menggunakan nth-child untuk positioning.
Mobile CSS ada di @media (max-width: 768px).

Keluaran yang diharapkan:
1. Identify CSS issue causing overlap
2. Fix responsive positioning
3. Ensure konsistensi dengan /prototype/v1
```

### 3. Refactoring

**Prompt Template:**

```
Tolong refactor [file/component] untuk:

CURRENT STATE:
  [Describe current implementation]

DESIRED STATE:
  [Describe target implementation]

MOTIVATION:
  [Why refactor?]

CONSTRAINTS:
  - [ ] Don't break existing functionality
  - [ ] Maintain same UI appearance
  - [ ] Follow project patterns
  - [ ] Update related files if needed

Keluaran yang diharapkan:
1. Refactored code
2. Explanation of changes
3. Updated related files
```

**Example:**

```
Tolong refactor TimelineItem component untuk:

CURRENT STATE:
  - Menggunakan HTML string dengan @html directive
  - Content dengan <br /> tags
  - Data: { title, content: "<strong>...</strong><br />..." }

DESIRED STATE:
  - Struktur data eksplisit
  - Content: { title, subtitle, description }
  - Deklaratif Svelte markup tanpa @html

MOTIVATION:
  - Security (avoid XSS)
  - Easier to maintain
  - Better TypeScript support
  - More explicit and readable

CONSTRAINTS:
  - ✅ Don't change visual appearance
  - ✅ Keep existing CSS
  - ✅ Update ProgramSection.svelte data structure
  - ✅ Maintain responsive design

Keluaran: Refactored TimelineItem + updated ProgramSection
```

### 4. Code Review Request

**Prompt Template:**

````
Tolong review kode ini di [file]:

CODE:
```[language]
[Code snippet]
````

SPECIFIC CONCERNS:

1. [Concern 1]
2. [Concern 2]
3. [Concern 3]

ASPECTS TO REVIEW:

- [ ] Code quality and readability
- [ ] TypeScript type safety
- [ ] Security considerations
- [ ] Performance implications
- [ ] Accessibility compliance
- [ ] Best practices adherence

Keluaran yang diharapkan:

1. Feedback untuk setiap concern
2. Specific suggestions untuk improvement
3. Code examples jika perlu

```

### 5. Documentation Creation

**Prompt Template:**
```

Tolong buat dokumentasi untuk [component/feature]:

TOPIC:
[What to document]

AUDIENCE:
[Who will read this]

SECTIONS TO INCLUDE:

1. Overview
2. Usage examples
3. API reference (if applicable)
4. Props/Configuration
5. Best practices
6. Common issues

SIMILAR DOCS:
[Reference existing documentation style]

OUTPUT FORMAT:
Markdown file di [location]

```

**Example:**
```

Tolong buat dokumentasi untuk TimelineItem component:

TOPIC:
TimelineItem - Komponen untuk display timeline items

AUDIENCE:
Developers yang akan menggunakan atau maintain komponen

SECTIONS TO INCLUDE:

1. Overview dan purpose
2. Props interface dengan TypeScript
3. Usage examples
4. Styling (CSS classes, responsive breakpoints)
5. Positioning logic (nth-child)
6. Best practices
7. Common pitfalls dan solutions

SIMILAR DOCS:
docs/components/FeatureCard.md (jika ada)

OUTPUT: docs/components/TimelineItem.md

```

---

## Advanced Techniques

### 1. Multi-file Refactoring

```

Saya ingin refactor struktur berikut:

BEFORE:
src/lib/sections/AboutSection.svelte (monolithic)

AFTER:
src/lib/sections/AboutSection.svelte (container)
src/lib/components/FeatureCard.svelte (reusable)

- Data structure untuk features

CONSTRAINTS:

- Keep all CSS intact
- Don't change visual appearance
- Make FeatureCard reusable

Please:

1. Generate FeatureCard.svelte component
2. Update AboutSection.svelte to use it
3. Extract feature data to const
4. Ensure CSS works correctly

```

### 2. Pattern Recognition

```

Analyze patterns in existing codebase:

FILES TO ANALYZE:

- src/lib/components/FeatureCard.svelte
- src/lib/components/BenefitCard.svelte
- src/lib/components/TimelineItem.svelte

TASK:
Create new component BenefitCard.svelte that follows same patterns

CONSTRAINTS:

- Same prop structure pattern
- Same styling approach
- Same TypeScript interface style

```

### 3. Code Generation from Design

```

Berdasarkan design di /prototype/v1 untuk Benefits section:

DESIGN SPEC:

- Purple gradient background (#667eea to #764ba2)
- Grid layout (3 columns desktop, 2 tablet, 1 mobile)
- Glassmorphism cards dengan backdrop-filter
- Hover effect: scale(1.05)

IMPLEMENTATION NEEDED:

1. BenefitsSection.svelte (container)
2. BenefitCard.svelte (reusable component)
3. Data structure untuk benefits array

PASTIKAN:

- Responsive di semua breakpoints
- TypeScript interfaces
- Scoped CSS per komponen

```

---

## Debugging with AI

### 1. Error Message Analysis

```

Error message:

```
[Error message from console]
```

LOCATION:
[File path and line number]

CODE CONTEXT:

```typescript
[Relevant code snippet]
```

ATTEMPTED FIXES:

1. [Fix attempt 1]
2. [Fix attempt 2]

Please:

1. Analyze root cause
2. Suggest proper fix
3. Explain why error occurred

```

### 2. Performance Issue

```

Performance issue:

PROBLEM:
Page loading too slow / Component re-rendering too often

SYMPTOMS:

- [Describe symptoms]

COMPONENT:
src/lib/sections/[Component].svelte

DATA:
[Describe data structure and size]

Please:

1. Identify performance bottlenecks
2. Suggest optimizations
3. Implement lazy loading if applicable

```

---

## Best Practices

### ✅ DO

1. **Provide Context**
   - Include relevant code files
   - Mention project structure
   - Reference similar implementations

2. **Be Specific**
   - Define requirements clearly
   - Specify constraints
   - Give examples of desired output

3. **Iterate**
   - Start with basic prompt
   - Refine based on results
   - Ask follow-up questions

4. **Test AI Output**
   - Always review generated code
   - Test in actual environment
   - Don't blindly accept suggestions

### ❌ DON'T

1. **Don't assume AI understands context**
   - Always provide project context
   - Include relevant file paths
   - Explain domain-specific terms

2. **Don't ask everything in one prompt**
   - Break down complex tasks
   - One prompt = one focused task

3. **Don't skip testing**
   - AI code may have bugs
   - Always test thoroughly
   - Review before committing

4. **Don't forget documentation**
   - Document complex logic
   - Explain non-obvious decisions
   - Update related docs

---

## Common Patterns

### Pattern 1: Component Creation Workflow

```

1. Define Props Interface
   ↓
2. Describe Requirements
   ↓
3. Get Initial Implementation
   ↓
4. Refine based on feedback
   ↓
5. Add Styling
   ↓
6. Make Responsive
   ↓
7. Add Accessibility
   ↓
8. Final Review

```

### Pattern 2: Bug Fix Workflow

```

1. Report symptom
   ↓
2. AI analyzes
   ↓
3. AI suggests fix
   ↓
4. Implement fix
   ↓
5. Test fix
   ↓
6. Verify no regressions

```

### Pattern 3: Refactoring Workflow

```

1. Show current code
   ↓
2. Describe desired state
   ↓
3. AI refactors
   ↓
4. Review changes
   ↓
5. Update related files
   ↓
6. Test functionality

```

---

## Example Session

```

Developer:
"Tolong buat komponen Card yang reusable dengan
background gradient dan hover effect,
mengikuti pattern dari BenefitCard.svelte"

AI:
[Generates Card.svelte component]

Developer:
"Saya sudah test, tapi gradient tidak smooth.
Juga perlu support untuk dark mode."

AI:
[Updates gradient calculations,
adds dark mode support]

Developer:
"Perfect! Tapi ada issue di mobile:
cards terlalu lebar. Tolong adjust."

AI:
[Fixes responsive width issue]

Developer:
"Terima kasih! Code sudah bagus."

```

---

## Resources

- [Project Documentation](docs/)
- [Component Patterns](src/lib/components/)
- [Design Reference](/prototype/v1)
- [Security Guidelines](docs/SECURITY.md)
- [Workflow Guide](docs/WORKFLOW.md)

---

**Tips Penting:**

1. 🎯 **Be Specific**: Makin spesifik prompt, makin baik hasilnya
2. 🔄 **Iterate**: Don't expect perfect output first time
3. ✅ **Test**: Selalu test output AI sebelum commit
4. 📚 **Learn**: Pahami kode yang dihasilkan AI
5. 🤝 **Collaborate**: AI adalah tool, bukan replacement

**Happy Coding! 🚀**

**Last Updated**: 2025-10-26

```
