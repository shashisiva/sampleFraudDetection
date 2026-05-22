## 1. API and service (To Do gaps)

- [x] 1.1 FDS-10: Audit history `ORDER BY created_at DESC`; add `markedBy` (analyst name from users join)
- [x] 1.2 FDS-15: Reject null, empty string, and wrong-case status on PATCH
- [x] 1.3 FDS-09: Add `server/tests/transactionService.test.js` (pagination, ordering, status validation)

## 2. Analyst UI (To Do gaps)

- [x] 2.1 FDS-07: Status badges with icons for pending / fraud / legitimate
- [x] 2.2 FDS-12: Collapsible audit panel per row (lazy fetch on expand)
- [x] 2.3 FDS-19: Mark Fraud / Mark Legitimate buttons, optimistic UI, error toast, disable while loading
- [x] 2.4 FDS-18/20: Table columns Date, Merchant, Account ID, Amount, Status; loading spinner; compact rows
- [x] 2.5 FDS-20: Contrast and brand colour polish in CSS

## 3. DevOps and docs

- [x] 3.1 FDS-24: `.github/workflows/ci.yml` — npm test on PR to main
- [x] 3.2 FDS-25: `docs/OPERATING_MODEL.md` per backlog sections
- [x] 3.3 Re-export note in README; run full test suite
