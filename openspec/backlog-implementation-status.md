# Backlog implementation status (To Do items)

Tracks **FDS-06 … FDS-25** from `openspec/backlog-todos.md` (Excel Status = **To Do**).  
Updated after `backlog-todos-sprint` and `backlog-todos-round-2`.

| ID | Summary | Status | Notes |
|----|---------|--------|-------|
| FDS-06 | Mark transaction as legitimate | **Implemented** | `PATCH` + audit (`fraud-detection-system`) |
| FDS-07 | Transaction status badge display | **Implemented** | Icons + optimistic UI (`backlog-todos-sprint`) |
| FDS-08 | List ordered newest first | **Implemented** | DB `ORDER BY created_at DESC` |
| FDS-09 | Transaction service unit tests | **Implemented** | `transactionService.test.js` + coverage ≥ 80% (round-2) |
| FDS-10 | View transaction audit trail | **Implemented** | `GET /history`; empty `[]` tested (round-2) |
| FDS-11 | Audit on every status change | **Implemented** | DB transaction wrap |
| FDS-12 | Collapsible audit trail in UI | **Implemented** | Row expand (`backlog-todos-sprint`) |
| FDS-15 | Status enum validation | **Implemented** | fraud/legitimate only; missing key → 400 (round-2) |
| FDS-16 | No stack traces in responses | **Implemented** | Generic 500 handler |
| FDS-17 | JWT secret from env | **Implemented** | `validateConfig` + `.env` |
| FDS-18 | Table renders on load | **Implemented** | Auto `loadTransactions` on login |
| FDS-19 | Fraud / Legitimate buttons | **Implemented** | Mark Fraud / Mark Legitimate + toast |
| FDS-20 | UI styling sprint | **Partial** | Compact table + 3 colours; formal a11y audit not run |
| FDS-24 | GitHub Actions CI | **Implemented** | `ci.yml` + `test:coverage` 70% gate (round-2) |
| FDS-25 | Operating Model doc | **Implemented** | `docs/OPERATING_MODEL.md` |

## Excel sync

Mark rows **Done** in `Fraud_Detection_Backlog.xlsx`, then:

```powershell
python scripts/export-backlog-todos.py
```

So `backlog-todos.md` only lists remaining work.
