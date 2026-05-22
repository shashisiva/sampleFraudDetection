## Executive summary

The fraud-detection-system change implements a coherent v1 security baseline: parameterized SQL, bcrypt password hashing, JWT on protected routes, and atomic status updates with audit logging. Several gaps remain typical of a demo/MVP build—weak default secrets, permissive CORS, JWT in `localStorage`, no login rate limiting, and hardcoded credentials in the UI.

**Recommendation:** **Proceed with conditions** — acceptable for local learning/demo; address Critical/High items before any production or shared-network deployment.

## Threat model

### Assets

- Analyst credentials (`users.password_hash`, JWT secret)
- JWT session tokens (bearer access to all protected APIs)
- Transaction data (`transactions` — amounts, merchants, fraud/legitimate status)
- Audit trail (`audit_log` — non-repudiation for regulatory/ops accountability)
- SQLite database file (`server/data/fraud.db`)

### Trust boundaries

```text
[Analyst browser] --HTTPS?--> [Express API :3000] --> [SQLite file]
        |                           |
   localStorage JWT            JWT verify middleware
   static HTML/JS              Service layer + prepared statements
```

- **Browser ↔ API:** JWT in `Authorization: Bearer`; login over same origin when UI served from Express.
- **API ↔ DB:** Synchronous `better-sqlite3`; no network DB boundary in v1.

### Threat actors

| Actor | Goal |
|-------|------|
| Unauthenticated external | Brute-force login, access transaction APIs |
| Authenticated analyst (stolen token) | Mark transactions fraud/legitimate, read audit history |
| Malicious insider with DB file access | Alter transactions or audit rows outside API |
| XSS attacker (if UI compromised) | Steal JWT from `localStorage` |

## Findings

| ID | Severity | Category | Finding | Recommendation |
|----|----------|----------|---------|----------------|
| SEC-001 | High | Secrets | `config.js` falls back to `jwtSecret: "dev-secret-change-in-production"` if `JWT_SECRET` unset | Require strong `JWT_SECRET` at startup; fail fast if missing in non-dev environments |
| SEC-002 | High | CORS | `app.use(cors())` allows any origin by default | Restrict to known UI origins in production; disable credentials unless required |
| SEC-003 | Medium | Session | JWT stored in `localStorage` (`transactions.js`) | Prefer `httpOnly` `Secure` cookie + CSRF protection for production; document XSS risk for v1 |
| SEC-004 | Medium | AuthN | No rate limiting or lockout on `POST /auth/login` | Add rate limit (e.g. express-rate-limit) and generic delay on failed attempts |
| SEC-005 | Medium | AuthN | Demo password pre-filled in `transactions.html` (`value="analyst123"`) | Remove default values; use env-only seed docs for demos |
| SEC-006 | Medium | Transport | No TLS/HTTPS enforcement in app | Terminate TLS at reverse proxy; set `Secure` cookies if migrating off localStorage |
| SEC-007 | Medium | AuthZ | Any authenticated analyst can PATCH any transaction ID (no object-level roles) | Acceptable for v1 single-role ops; document; add roles if multi-team in v2 |
| SEC-008 | Low | Headers | No security headers (`helmet`) | Add `helmet` for `X-Content-Type-Options`, `X-Frame-Options`, CSP baseline |
| SEC-009 | Low | Input | `page` query param unbounded (large page numbers cause empty queries, not injection) | Cap `page` to `totalPages` or max reasonable value |
| SEC-010 | Low | Audit | Audit rows are append-only via API but SQLite file is mutable at OS level | File permissions on `data/fraud.db`; consider DB immutability/WORM for production |
| SEC-011 | Informational | SQLi | Queries use prepared statements (`?` placeholders) | Maintain parameterized queries for all new endpoints |
| SEC-012 | Informational | Audit integrity | Status update uses DB transaction wrapping UPDATE + INSERT | Keep pattern; add test for rollback on partial failure |

## Security requirements coverage

- [x] Authentication and session management — JWT + bcrypt login (gaps: rate limit, secret defaults)
- [x] Authorization (least privilege, object-level access) — JWT required on protected routes; single analyst role only
- [x] Input validation and injection defenses — Status enum validated; SQL parameterized; email/password presence only
- [x] Audit logging integrity and non-repudiation — `audit_log` on PATCH with user id/email; chronological history API
- [ ] Secrets and configuration management — `.env.example` present; weak dev defaults remain
- [ ] Transport and storage security — HTTP dev server; local SQLite file
- [x] Error handling and information disclosure — Generic 401 on auth failure; no stack traces to client

## Architecture review

**Authentication flow**

- `POST /auth/login` → bcrypt verify → JWT (`sub`, `email`) signed with `JWT_SECRET`.
- `requireAuth` middleware validates Bearer token and reloads user from DB — good revocation path if user deleted.

**API surface (matches brief)**

- Four endpoints implemented; `/health` is unauthenticated (low risk, info disclosure minimal).
- `PATCH /transactions/:id/status` correctly couples status change + audit insert in one SQLite transaction.

**UI**

- Same-origin API calls when served from Express static — avoids simple CORS misuse in dev.
- Token persists across refreshes in `localStorage` — convenient but XSS-sensitive.

**Gaps vs specs**

- Specs do not require HTTPS, rate limiting, or CORS policy — consider ADDED requirements if production is in scope.

## Pre-implementation checklist

- [x] SEC-001: Enforce `JWT_SECRET` from environment; remove hardcoded fallback for production builds
- [x] SEC-002: Configure CORS allowlist for deployment origin(s)
- [x] SEC-004: Add login rate limiting
- [x] SEC-005: Remove hardcoded credentials from `transactions.html`
- [x] SEC-003: Document JWT/localStorage threat model in `server/README.md` (or plan cookie migration)
- [x] SEC-008: Add `helmet` middleware
- [x] SEC-009: Cap pagination `page` query param
- [x] Re-run tests after security hardening
- [ ] Human security sign-off before production deploy

## Sign-off

| Role | Status | Notes |
|------|--------|-------|
| Security architect reviewer | **Approved (dev)** | Hardening applied 2026-05-22 per section 7 tasks. Human sign-off still required before production. |
