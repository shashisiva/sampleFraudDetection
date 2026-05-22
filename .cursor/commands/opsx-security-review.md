---
name: /opsx:security-review
id: opsx-security-review
category: Workflow
description: Security architect review — threat model and findings before implementation
---

Run the **security architect reviewer** for an OpenSpec change.

Creates or refreshes `security-review.md` using the `spec-with-security-review` schema (threat model, SEC-* findings, pre-implementation checklist, sign-off).

**Input**: Optional change name (e.g. `/opsx:security-review fraud-detection-system`).

**When to use**

- After design and specs exist, before `/opsx:apply`
- Re-review after major design or API changes
- User asks for security sign-off or threat modeling

**Steps**: Follow the `openspec-security-architect-review` skill exactly.

**Requires**: `proposal.md`, `design.md`, `specs/**/*.md` complete for the change.

**Next**: Address Critical/High findings in `tasks.md`, then `/opsx:apply`.
