## Context

Greenfield build for GlobalBank fraud operations. Analysts are authenticated users. The system is tiered: HTML UI → Express API (4 routes) → service layer (business logic) → SQLite (`transactions`, `audit_log`). JWT required on every route except `POST /auth/login`.

Existing repo contains a static hello-world demo; this change adds a separate fraud-review application.

## Goals / Non-Goals

**Goals:**

- Implement exactly the four REST endpoints specified in the client brief
- Enforce JWT on protected routes; return user object + token from login
- Paginate transactions (newest first, page size ≤ 50)
- On status update: persist new status and append `audit_log` row (who, when, action sequence)
- Provide `transactions.html` for analyst workflow
- Seed SQLite with sample transactions for demo/testing
- Jest + Supertest coverage for auth, list, status update, and audit history

**Non-Goals (v1):**

- AI-based fraud scoring
- Bulk mark / batch operations
- CSV export
- Reporting dashboard
- Multi-tenant or role-based permissions beyond authenticated analyst

## Decisions

1. **Project layout**
   - `server/` — Express app, routes, services, DB, tests
   - `public/` — `transactions.html`, static assets, client JS
   - **Rationale**: Separates API from UI; matches architecture diagram layers.

2. **SQLite via `better-sqlite3` or `sqlite3`**
   - **Rationale**: Mandated stack; synchronous `better-sqlite3` simplifies tests and transactions.
   - **Alternative**: PostgreSQL — out of scope per brief.

3. **JWT with `jsonwebtoken`**
   - Bearer token in `Authorization` header for protected routes.
   - Login validates credentials against seeded users table or env-based demo user.

4. **Pagination**
   - Query params: `page` (default 1), fixed `limit=50` (max 50 enforced server-side).
   - Sort: `created_at DESC` (newest first).

5. **Transaction status values**
   - Enum: `pending` (initial), `fraud`, `legitimate` (or `Fraud`/`Legitimate` per API contract — normalize in service layer).

6. **Audit log schema**
   - Fields: `id`, `transaction_id`, `user_id`, `user_email` or `username`, `action` (e.g. `marked_fraud`, `marked_legitimate`), `created_at`, optional `previous_status`, `new_status`.
   - **Rationale**: Supports “who, when, sequence of actions” requirement.

7. **API path prefix**
   - Mount routes at `/auth/login`, `/transactions`, `/transactions/:id/status`, `/transactions/:id/history` as specified (adjust `:id` segment to match brief’s `/:id/status` pattern under `/transactions`).

## Risks / Trade-offs

- **[Risk] Credential storage** → v1: hashed passwords for demo users in SQLite seed; document that production needs proper secret management.
- **[Risk] Concurrent status updates** → Use DB transaction when updating status + inserting audit row.
- **[Trade-off] Single HTML page** → Faster v1; no SPA framework per stack constraints.

## Migration Plan

Initial deploy: run migrations/seed script, start Express server, open `transactions.html` via static server or Express static middleware.

Rollback: stop server; DB file can be deleted/reseeded.

## Open Questions

- Confirm demo analyst credentials (e.g. `analyst@globalbank.com` / env password) during implementation.
- Confirm exact status string casing in API JSON (`fraud` vs `Fraud`) — design assumes lowercase in DB, display labels in UI.
