## Why

`openspec/backlog-todos.md` lists 15 Excel **To Do** stories. Several are already implemented in `server/` and `public/`. This change closes the **remaining gaps** only — no duplicate work on done items.

## What Changes

**Verified already done (no code changes):** FDS-06, FDS-08, FDS-11, FDS-16, FDS-17, FDS-18 (basic load), partial FDS-10/FDS-15/FDS-19.

**Implementing from To Do:**

| ID | Gap |
|----|-----|
| FDS-07 | Status badges (pending/unmarked, icons), optimistic badge updates |
| FDS-09 | Direct `transactionService` unit tests |
| FDS-10 | Audit history newest-first; `markedBy` field |
| FDS-12 | Collapsible per-row audit panel (fetch on expand) |
| FDS-15 | Reject null, empty, wrong-case status on PATCH |
| FDS-19 | "Mark Fraud" / "Mark Legitimate" labels, optimistic UI, error toast |
| FDS-20 | UI density and contrast polish |
| FDS-24 | GitHub Actions CI (`npm test`) |
| FDS-25 | Operating Model documentation |

## Capabilities

### New Capabilities

- `backlog-ui-audit-row`: Collapsible row audit trail in analyst UI
- `backlog-ci`: GitHub Actions test workflow

### Modified Capabilities

<!-- None in main specs yet — delta in change specs if needed -->

## Impact

- `server/`, `public/`, `.github/workflows/`, `docs/OPERATING_MODEL.md`
