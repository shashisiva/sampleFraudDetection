# test open spec

Learning workspace with [OpenSpec](https://github.com/Fission-AI/OpenSpec) — spec-driven changes, slash commands, and sample apps.

## Projects in this repo

### 1. Hello World (static demo)

Simple `index.html` + `styles.css` at the repo root.

```powershell
Start-Process .\index.html
```

### 2. GlobalBank Fraud Detection System

Full-stack fraud review app for ops analysts (from client brief).

| Layer | Tech |
|-------|------|
| UI | `public/transactions.html` |
| API | Node.js, Express (4 REST routes) |
| Auth | JWT |
| DB | SQLite (`transactions`, `audit_log`) |
| Tests | Jest, Supertest |

**Quick start:**

```powershell
cd server
copy .env.example .env
npm.cmd install
npm.cmd run seed
npm.cmd start
```

Open http://localhost:3000/transactions.html

- **Login:** `analyst@globalbank.com` / `analyst123`

See [server/README.md](server/README.md) for API details and test commands.

## OpenSpec workflow

This project uses schema **`spec-with-security-review`** (see `openspec/config.yaml`).

```text
/opsx:propose <idea>        →  proposal, specs, design, security-review, tasks
/opsx:security-review        →  refresh security architect review only
/opsx:apply                  →  implement tasks (after security findings addressed)
/opsx:archive                →  merge specs & archive change
```

Security review produces `security-review.md` with threat model, SEC-* findings, and a pre-implementation checklist. Critical/High items should appear in `tasks.md` before apply.

### Backlog (Excel → OpenSpec)

```powershell
python scripts/export-backlog-todos.py   # To Do only → openspec/backlog-todos.md
/opsx:propose backlog-todos-sprint       # plan gap items
/opsx:apply                              # implement
```

See `docs/OPERATING_MODEL.md` for the full pipeline.

Active changes live under `openspec/changes/`. Canonical specs under `openspec/specs/`.
