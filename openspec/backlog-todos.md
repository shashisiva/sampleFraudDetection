# Fraud Detection Backlog — To Do only

> **Implementation status:** See [`backlog-implementation-status.md`](backlog-implementation-status.md) — most items below are **already implemented** in code (`backlog-todos-sprint`, `fraud-detection-system`). Re-export after updating Excel Status to Done.

Source: `Fraud_Detection_Backlog.xlsx` → sheet **Product Backlog** (Status = **To Do**)
Exported: 15 items

Use with OpenSpec: `/opsx:propose implement FDS-XX from backlog-todos` or paste a story ID in chat.

| ID | Type | Summary | Priority | Points | REQ-ID |
|---|---|---|---|---|---|
| FDS-06 | Story | Mark transaction as legitimate | Must Have | 3 | REQ-002 |
| FDS-07 | Story | Transaction status badge display | Must Have | 3 | REQ-001 |
| FDS-08 | Bug | Fix: transaction list not ordered newest first | Must Have | 1 | REQ-001 |
| FDS-09 | Task | Transaction service unit tests | Must Have | 3 | REQ-001 |
| FDS-10 | Story | View transaction audit trail | Must Have | 3 | REQ-003 |
| FDS-11 | Story | Audit entry written on every status change | Must Have | 3 | REQ-003 |
| FDS-12 | Story | Collapsible audit trail in UI | Should Have | 3 | REQ-003 |
| FDS-15 | Story | Status enum validation on PATCH endpoint | Must Have | 2 | REQ-002 |
| FDS-16 | Story | No stack traces in error responses | Must Have | 1 | REQ-004 |
| FDS-17 | Bug | Fix: SonarQube Critical — hardcoded JWT secret | Must Have | 1 | REQ-004 |
| FDS-18 | Story | Transaction table renders on load | Must Have | 3 | REQ-001 |
| FDS-19 | Story | Fraud / Legitimate action buttons per row | Must Have | 5 | REQ-002 |
| FDS-20 | Story | UI Design — styling sprint | Should Have | 3 | REQ-001 |
| FDS-24 | Task | GitHub Actions CI pipeline | Must Have | 2 | REQ-004 |
| FDS-25 | Story | Operating Model documentation | Must Have | 5 | REQ-004 |

## Details

### FDS-06 — Mark transaction as legitimate

**User story:** As an ops analyst, I want to mark a transaction as legitimate so that it is cleared from review and the decision is recorded.

**Acceptance criteria:**

- Given authenticated user, When PATCH /transactions/:id/status with { status: 'legitimate' }, Then 200 with updated transaction
- Given marking as legitimate, Then audit_log entry written
- Given null status in body, Then 400
- Given empty body, Then 400

### FDS-07 — Transaction status badge display

**User story:** As an ops analyst, I want each transaction to show a clear status badge so that I can see at a glance which transactions still need review.

**Acceptance criteria:**

- Given status = 'unmarked', badge is grey ⚪
- Given status = 'fraud', badge is red 🔴
- Given status = 'legitimate', badge is green 🟢
- Badge updates immediately on mark action (optimistic UI)

### FDS-08 — Fix: transaction list not ordered newest first

**User story:** As an ops analyst, I want to always see the most recent transactions first so that I review the latest activity immediately on load.

**Acceptance criteria:**

- Given GET /transactions, response array is ordered by date DESC
- Most recent transaction appears at index 0
- Ordering is applied at the DB query level (not client-side sort)

### FDS-09 — Transaction service unit tests

**User story:** As a developer, I want unit tests for transactionService so that all business logic is provably correct without HTTP.

**Acceptance criteria:**

- Tests for getList(): pagination, ordering, max 50 limit
- Tests for updateStatus(): valid/invalid status, audit log write
- Coverage for transactionService.js >= 80%
- Tests run without HTTP (direct service import)

### FDS-10 — View transaction audit trail

**User story:** As an ops analyst, I want to see the full audit trail for any transaction so that I can review the history of decisions made on it.

**Acceptance criteria:**

- Given authenticated user, When GET /transactions/:id/history, Then 200 with array of audit entries ordered newest first
- Audit entry includes: id, transaction_id, new_status, marked_by, timestamp
- Given no audit history, Then 200 with empty array
- Given non-existent transaction ID, Then 404

### FDS-11 — Audit entry written on every status change

**User story:** As a compliance officer, I want every status change to be written to the audit log automatically so that no decision goes unrecorded.

**Acceptance criteria:**

- Every PATCH /transactions/:id/status creates exactly one audit_log row
- Audit row includes: transaction_id, new_status, marked_by (from JWT), timestamp (server time)
- Audit writes are transactional — if the status update fails, no audit entry is written
- Audit entries are immutable — no DELETE or UPDATE on audit_log rows

### FDS-12 — Collapsible audit trail in UI

**User story:** As an ops analyst, I want to expand an audit trail panel for any transaction without leaving the main list so that I can review history efficiently.

**Acceptance criteria:**

- Clicking a transaction row expands a collapsible audit panel below it
- Panel fetches GET /transactions/:id/history on expand (not on page load)
- Each entry shows: analyst name, new status, timestamp formatted as 'DD MMM YYYY HH:MM'
- Panel collapses when clicked again

### FDS-15 — Status enum validation on PATCH endpoint

**User story:** As a developer, I want PATCH /transactions/:id/status to reject any status value not in the approved list so that invalid data cannot enter the system.

**Acceptance criteria:**

- Given status = 'fraud', Then 200 — accepted
- Given status = 'legitimate', Then 200 — accepted
- Given status = 'FRAUD' (wrong case), Then 400
- Given status = 'deleted', Then 400
- Given status = null, Then 400
- Given status = '' (empty string), Then 400

### FDS-16 — No stack traces in error responses

**User story:** As a developer, I want error responses to return clean JSON without stack traces so that internal implementation details are not exposed to clients.

**Acceptance criteria:**

- Given any unhandled error, API returns { error: 'Internal server error' } with 500
- Stack trace is logged server-side but never returned in response body
- SonarQube scan shows zero sensitive data exposure warnings

### FDS-17 — Fix: SonarQube Critical — hardcoded JWT secret

**User story:** As a developer, I want the JWT secret loaded from environment variables so that it is not exposed in source code.

**Acceptance criteria:**

- JWT_SECRET read from process.env.JWT_SECRET
- .env file added to .gitignore
- SonarQube scan shows zero hardcoded credential warnings
- App fails to start with clear error if JWT_SECRET not set

### FDS-18 — Transaction table renders on load

**User story:** As an ops analyst, I want the transaction list to load automatically when I open the app so that I can start reviewing immediately.

**Acceptance criteria:**

- On page load, GET /transactions is called automatically
- Table renders with columns: Date, Merchant, Account ID, Amount, Status
- Loading spinner shown while fetching
- Empty state message shown if no transactions returned

### FDS-19 — Fraud / Legitimate action buttons per row

**User story:** As an ops analyst, I want Fraud and Legitimate buttons on each transaction row so that I can mark decisions without navigating away from the list.

**Acceptance criteria:**

- Each row has two buttons: 'Mark Fraud' and 'Mark Legitimate'
- Clicking a button triggers PATCH /transactions/:id/status
- Optimistic UI: status badge updates immediately before response
- On API error: badge reverts and error toast is shown
- Buttons disabled while request is in-flight

### FDS-20 — UI Design — styling sprint

**User story:** As an ops analyst, I want the interface to be visually clear and density-appropriate so that I can review many transactions quickly without eye strain.

**Acceptance criteria:**

- Max 3 brand colours used
- Status badges are visually distinct at a glance (colour + icon)
- Table row height allows 20+ rows visible without scrolling on a 1080p monitor
- UI passes basic accessibility check (colour contrast >= 4.5:1)

### FDS-24 — GitHub Actions CI pipeline

**User story:** As a developer, I want a CI pipeline that runs tests on every PR so that broken code cannot be merged to main.

**Acceptance criteria:**

- GitHub Actions workflow: triggers on PR to main
- Runs: npm install → npm test
- Fails build if any test fails
- Fails build if coverage drops below 70%

### FDS-25 — Operating Model documentation

**User story:** As a new team member, I want a complete Operating Model document so that I can run and maintain the system without asking the original developers.

**Acceptance criteria:**

- Sections: Pipeline Overview, Agent Config Guide, Environment Setup, Day-by-Day Run Guide, Troubleshooting (10 most common failures), Version History
- Environment setup steps verified on a fresh machine
- All agent system prompts documented with example inputs/outputs
