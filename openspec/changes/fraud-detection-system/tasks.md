## 1. Project setup

- [x] 1.1 Create `server/package.json` with Express, better-sqlite3, jsonwebtoken, bcrypt, cors, dotenv; dev deps Jest, Supertest
- [x] 1.2 Add npm scripts: `start`, `dev`, `test`, `seed`
- [x] 1.3 Create `server/.env.example` with JWT_SECRET and demo analyst credentials

## 2. Database layer

- [x] 2.1 Define SQLite schema: `users`, `transactions`, `audit_log` with indexes on `transactions.created_at` and `audit_log.transaction_id`
- [x] 2.2 Implement migration/seed script with demo analyst user and sample transactions (50+ for pagination testing)
- [x] 2.3 Implement DB access module (init, query helpers)

## 3. Service layer

- [x] 3.1 Implement auth service (validate credentials, issue JWT, decode user from token)
- [x] 3.2 Implement transaction service (list paginated newest-first, max 50, update status in transaction with audit insert)
- [x] 3.3 Implement audit service (list history by transaction id, ordered chronologically)

## 4. API layer (4 routes)

- [x] 4.1 `POST /auth/login` — return JWT + user object
- [x] 4.2 `GET /transactions` — JWT middleware, pagination, newest first
- [x] 4.3 `PATCH /transactions/:id/status` — JWT, validate fraud/legitimate, audit write
- [x] 4.4 `GET /transactions/:id/history` — JWT, return audit trail
- [x] 4.5 Wire Express app, error handling, CORS, static `public/` if serving UI from same server

## 5. Analyst UI

- [x] 5.1 Create `public/transactions.html` with login form, transaction table, Fraud/Legitimate actions, pagination controls
- [x] 5.2 Add client JS for JWT storage, API calls to all four endpoints, history panel/modal
- [x] 5.3 Basic styling for readable ops-analyst workflow

## 6. Tests and documentation

- [x] 6.1 Jest + Supertest: login success/failure, 401 without token, list pagination cap, status update + audit creation, history endpoint
- [x] 6.2 Add `server/README.md` with setup, seed, run, and API examples
- [x] 6.3 Update root README with fraud system overview and how it relates to hello-world demo

## 7. Security hardening (from security-review.md)

- [x] 7.1 SEC-001: Require `JWT_SECRET` from environment at startup; fail fast if missing outside dev; remove weak default in `config.js` for production
- [x] 7.2 SEC-002: Restrict CORS to configured allowlist (e.g. `CORS_ORIGIN` in `.env`) instead of open `cors()`
- [x] 7.3 SEC-004: Add rate limiting on `POST /auth/login` (e.g. `express-rate-limit`)
- [x] 7.4 SEC-005: Remove pre-filled demo email/password from `public/transactions.html`
- [x] 7.5 SEC-003: Document JWT in `localStorage` and XSS risk in `server/README.md`; note cookie migration path for production
- [x] 7.6 SEC-008: Add `helmet` middleware for security headers
- [x] 7.7 SEC-009: Cap `page` query param to valid range (≤ totalPages or max page limit)
- [x] 7.8 Re-run `npm test` after security changes; add test for rate limit or JWT secret validation if applicable
- [x] 7.9 Update security-review.md sign-off after human review of hardening
