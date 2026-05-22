## Why

`openspec/backlog-todos.md` still lists 15 Excel **To Do** stories, but **`backlog-todos-sprint`** already implemented the main code gaps (FDS-07–FDS-20, FDS-24, FDS-25). This change addresses **remaining acceptance-criteria gaps** and **backlog traceability** so the backlog file reflects reality before new work starts.

## What Changes

**Already implemented (verify + document only):** FDS-06, FDS-07, FDS-08, FDS-09 (basic tests), FDS-10, FDS-11, FDS-12, FDS-15 (partial), FDS-16, FDS-17, FDS-18, FDS-19, FDS-20 (partial), FDS-24 (tests only), FDS-25.

**This change implements:**

| ID | Remaining gap |
|----|----------------|
| FDS-09 | Jest coverage report; `transactionService.js` ≥ 80% lines |
| FDS-10 | Explicit test: empty audit history returns `[]` |
| FDS-15 | `PATCH` with missing `status` key → 400 |
| FDS-24 | CI fails if coverage below 70% (backlog AC) |
| ALL | `openspec/backlog-implementation-status.md` — map each FDS-XX to Done/In code vs still open |

**Out of scope:** Re-build features already in `backlog-todos-sprint`; Excel Status column update (manual).

## Capabilities

### New Capabilities

- `backlog-traceability`: Implementation status matrix synced to code

### Modified Capabilities

- `transaction-list`: PATCH body validation edge cases
- `audit-trail`: Empty history contract tests

## Impact

- `server/package.json`, `server/tests/`, `.github/workflows/ci.yml`, `openspec/backlog-*.md`
