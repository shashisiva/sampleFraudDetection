# Fraud Detection System — Operating Model

## Pipeline overview

```text
Excel backlog (To Do) → openspec/backlog-todos.md → /opsx:propose → /opsx:apply → server + public
```

| Stage | Tool | Output |
|-------|------|--------|
| Backlog | `Fraud_Detection_Backlog.xlsx` | Product stories FDS-XX |
| Export | `python scripts/export-backlog-todos.py` | `openspec/backlog-todos.md` |
| Plan | OpenSpec `/opsx:propose` | `openspec/changes/<name>/` |
| Build | OpenSpec `/opsx:apply` | Code + tests |
| Review | `/opsx:security-review` | `security-review.md` |
| Release | `/opsx:archive` | Main specs updated |

## Agent config guide

- **Schema:** `spec-with-security-review` in `openspec/config.yaml`
- **Context:** Project stack and backlog path injected for every artifact
- **Commands:** `/opsx:propose`, `/opsx:apply`, `/opsx:security-review`, `/opsx:archive`

Example: `Implement FDS-12 from openspec/backlog-todos.md`

## Environment setup

1. Node.js 20.19+
2. `cd server && copy .env.example .env`
3. `npm install && npm run seed`
4. `npm start` → http://localhost:3000/transactions.html
5. Login: `analyst@globalbank.com` / `analyst123`

## Day-by-day run guide

| Task | Command |
|------|---------|
| Refresh backlog export | `python scripts/export-backlog-todos.py` |
| Run API | `cd server && npm start` |
| Run tests | `cd server && npm test` |
| Coverage (CI gate) | `cd server && npm run test:coverage` |
| New feature | `/opsx:propose <description>` then `/opsx:apply` |

## Troubleshooting

1. **Login fails** — Run `npm run seed`; check `.env` credentials.
2. **Port 3000 in use** — Set `PORT=3001` in `.env`.
3. **npm blocked in PowerShell** — Use `npm.cmd` instead of `npm`.
4. **Excel export permission denied** — Close the `.xlsx` in Excel.
5. **CORS errors** — Set `CORS_ORIGIN` to your UI URL.
6. **JWT_SECRET error in production** — Set `NODE_ENV=production` and a 32+ char secret.
7. **Empty transaction list** — Run seed; confirm logged in.
8. **Tests fail on Windows** — Run from `server/` directory.
9. **OneDrive sync conflicts** — Pause sync or move repo outside OneDrive for builds.
10. **CI fails on PR** — Run `npm run test:coverage` locally in `server/` (70% lines global, 80% on `transactionService.js`).

## Version history

| Version | Date | Notes |
|---------|------|-------|
| 1.0 | 2026-05-22 | Initial FDS API + UI |
| 1.1 | 2026-05-22 | Security hardening + backlog To Do sprint |
| 1.2 | 2026-05-22 | Coverage gate + backlog traceability (`backlog-todos-round-2`) |
