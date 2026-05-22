---
name: openspec-security-architect-review
description: >-
  Run OpenSpec security architect review on a change. Creates or updates
  security-review.md using the spec-with-security-review schema. Use when the
  user asks for security review, security architect sign-off, threat modeling,
  or /opsx:security-review before implementation.
license: MIT
compatibility: Requires openspec CLI and schema spec-with-security-review.
metadata:
  author: project
  version: "1.0"
---

Perform a **security architect review** for an OpenSpec change.

**Input**: Optionally specify change name (e.g. `fraud-detection-system`). If omitted, use conversation context or run `openspec list --json` and ask the user to select.

**Prerequisites**

- Change should use schema `spec-with-security-review` (project default in `openspec/config.yaml`)
- `proposal.md`, `design.md`, and `specs/**/*.md` should exist (security-review depends on them)

**Steps**

1. **Select change** — announce: `Using change: <name>`

2. **Check status**
   ```bash
   openspec status --change "<name>" --json
   ```
   If `security-review` is `blocked`, create missing dependencies first (`/opsx:continue`) or tell the user what's missing.

3. **Read context** — read proposal, design, all delta specs, and relevant implementation under `server/`, `public/` if it exists.

4. **Get artifact instructions**
   ```bash
   openspec instructions security-review --change "<name>" --json
   ```
   Follow `instruction`, `template`, `context`, and `rules`. Do NOT copy context/rules into the output file.

5. **Write or update** `openspec/changes/<name>/security-review.md`
   - Use SEC-001, SEC-002 for findings
   - Include threat model, findings table, coverage checklist, architecture review, pre-implementation checklist, sign-off
   - Be specific to this change (JWT routes, SQLite tables, audit_log, etc.)

6. **If tasks.md already exists** — suggest adding tasks for Critical/High findings; offer to update tasks.md with `- [ ]` items referencing SEC-* IDs.

7. **Show status**
   ```bash
   openspec status --change "<name>"
   ```

**Output format**

```markdown
## Security review complete

**Change:** <name>
**Artifact:** security-review.md
**Recommendation:** Proceed | Proceed with conditions | Block

### Top findings
- SEC-001 (Critical): ...
- SEC-002 (High): ...

Run `/opsx:apply` only after Critical/High items are in tasks.md or accepted as risk.
```

**Guardrails**

- Do not implement code during review — only the security-review artifact (unless user explicitly asks to add security tasks to tasks.md)
- Do not guess; inspect the codebase for actual auth, validation, and audit patterns
- For fraud/audit systems: treat audit integrity and authorization on `:id` routes as in-scope
