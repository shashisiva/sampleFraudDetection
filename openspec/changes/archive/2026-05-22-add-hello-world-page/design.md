## Context

Greenfield workspace with no application code. The first deliverable is a static hello world page to validate OpenSpec workflow and provide a runnable artifact.

## Goals / Non-Goals

**Goals:**

- Single static HTML page with visible "Hello, World!" greeting
- Minimal CSS for readable typography and centered layout
- Document how to view the page locally (double-click or simple static server)
- Keep dependencies at zero (no npm project required unless user prefers later)

**Non-Goals:**

- Framework setup (React, Next.js, etc.)
- Build tooling, CI, or deployment pipelines
- Backend API, routing, or multi-page site

## Decisions

1. **Static HTML + CSS at project root**
   - **Rationale**: Simplest path for hello world; opens directly in any browser without install steps.
   - **Alternative considered**: Vite/React scaffold — rejected as overkill for first change.

2. **Files: `index.html` and optional `styles.css`**
   - **Rationale**: Clear entry point; separation keeps HTML lean.
   - **Alternative**: Inline styles only — acceptable fallback if single-file preferred.

3. **Greeting text: "Hello, World!" in an `<h1>`**
   - **Rationale**: Conventional hello world; easy to verify visually.

4. **Page metadata**
   - Include `<title>`, `lang="en"`, and viewport meta for basic accessibility and mobile display.

## Risks / Trade-offs

- **[Risk] OneDrive path with spaces** → Use quoted paths in docs; file paths work fine in browsers.
- **[Risk] No live reload** → Acceptable for static demo; user can refresh browser manually.
- **[Trade-off] No bundler** → Faster setup; limits future scaling until a later change adds tooling.

## Migration Plan

N/A — initial content. Rollback is deleting `index.html` and `styles.css`.

## Open Questions

None for this scope.
