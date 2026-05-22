## 1. Backlog traceability

- [x] 1.1 Create `openspec/backlog-implementation-status.md` — all 15 To Do items with Implemented / Partial / Open
- [x] 1.2 Add note at top of `openspec/backlog-todos.md` pointing to status doc and `backlog-todos-sprint`

## 2. API acceptance gaps (FDS-10, FDS-15)

- [x] 2.1 Add API test: `GET .../history` returns `{ history: [] }` for transaction with no audit rows
- [x] 2.2 Add API test: `PATCH .../status` with `{}` body returns 400
- [x] 2.3 Ensure route returns 400 when `status` key is missing (not only empty string)

## 3. Coverage (FDS-09, FDS-24)

- [x] 3.1 Add Jest coverage config; script `test:coverage`
- [x] 3.2 Set coverage thresholds: global lines ≥ 70%, `transactionService.js` ≥ 80%
- [x] 3.3 Update `.github/workflows/ci.yml` to run `npm run test:coverage`

## 4. Verification

- [x] 4.1 Run full test suite with coverage; fix any threshold failures
- [x] 4.2 Update `docs/OPERATING_MODEL.md` with coverage command
