## Why

GlobalBank ops analysts currently review transactions on paper. A web application replaces that manual process with a secure, auditable system where analysts can list transactions, mark them as Fraud or Legitimate, and retain a full history of who changed what and when.

## What Changes

- **Backend**: Node.js + Express REST API with JWT auth (all routes except login require a token)
- **Database**: SQLite with `transactions` and `audit_log` tables
- **API** (exactly 4 endpoints):
  - `POST /auth/login` — authenticate, return JWT + user object
  - `GET /transactions` — paginated list (newest first, max 50 per page), authenticated
  - `PATCH /transactions/:id/status` — mark Fraud or Legitimate, write audit entry
  - `GET /transactions/:id/history` — full audit trail for one transaction
- **UI**: Browser HTML (`transactions.html`) for authenticated analysts to review and mark transactions
- **Tests**: Jest + Supertest for API and critical flows

## Capabilities

### New Capabilities

- `jwt-auth`: Login and JWT protection on all non-login routes
- `transaction-list`: Paginated transaction retrieval (newest first, 50 per page)
- `transaction-status`: Mark transactions as Fraud or Legitimate with validation
- `audit-trail`: Automatic audit entries on status change; per-transaction history API
- `analyst-ui`: HTML interface for listing, marking, and viewing audit history

### Modified Capabilities

<!-- None — greenfield fraud system alongside existing hello-world demo -->

## Impact

- New project structure under this repo (or dedicated `server/` + `public/` layout)
- Replaces paper workflow; no integration with existing `index.html` hello-world page unless later linked
- **In scope (v1)**: manual review, JWT, audit logging, SQLite, REST API, analyst UI
- **Out of scope (v1)**: AI scoring, bulk actions, CSV export, reporting dashboard
