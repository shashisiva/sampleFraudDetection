# GlobalBank Fraud Review API

Node.js + Express REST API with JWT auth and SQLite for ops analyst transaction review.

## Prerequisites

- Node.js 20.19+

## Setup

```powershell
cd server
copy .env.example .env
npm.cmd install
npm.cmd run seed
```

## Run

```powershell
npm.cmd start
```

- API: http://localhost:3000
- UI: http://localhost:3000/transactions.html

Demo login (after seed):

- **Email:** `analyst@globalbank.com`
- **Password:** `analyst123`

## API endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/auth/login` | No | Returns `{ token, user }` |
| GET | `/transactions?page=1` | JWT | Paginated list (newest first, max 50/page) |
| PATCH | `/transactions/:id/status` | JWT | Body: `{ "status": "fraud" \| "legitimate" }` |
| GET | `/transactions/:id/history` | JWT | Audit trail for one transaction |

Send JWT as `Authorization: Bearer <token>` on protected routes.

## Security

| Control | Implementation |
|---------|------------------|
| SEC-001 | `JWT_SECRET` required in production (`NODE_ENV=production`); min 32 chars |
| SEC-002 | CORS restricted to `CORS_ORIGIN` (default `http://localhost:3000`) |
| SEC-004 | Login rate limit: 20 attempts per 15 minutes per IP |
| SEC-008 | `helmet` security headers |
| SEC-009 | Pagination `page` capped to valid range |

### JWT in the browser (SEC-003)

The analyst UI stores the JWT in **`localStorage`**. Any XSS in the UI could steal the token. For production, prefer:

- `httpOnly`, `Secure`, `SameSite` session cookies
- Strict Content-Security-Policy (extend `helmet` config)
- No inline scripts in the UI

### Production checklist

```env
NODE_ENV=production
JWT_SECRET=<random-32+-char-secret>
CORS_ORIGIN=https://your-ui-origin.example
```

## Tests

```powershell
npm.cmd test
```

## Reseed database

```powershell
npm.cmd run seed
```

Deletes and recreates `data/fraud.db` with 55 sample transactions.
