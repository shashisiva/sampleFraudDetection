## Context

Backlog-driven sprint from `Fraud_Detection_Backlog.xlsx` (To Do filter). Codebase already has core FDS v1 APIs.

## Goals / Non-Goals

**Goals:** Close backlog gaps listed in proposal; map UI columns to Date, Merchant, Account ID (= external_id), Amount, Status.

**Non-Goals:** Re-implement auth, pagination, or audit write path already working.

## Decisions

1. **pending = backlog "unmarked"** — keep DB `pending`, display as grey unmarked badge.
2. **Row audit** — expand `<tr>` detail row; fetch history on first expand only.
3. **CI** — run tests on PR; skip 70% coverage gate until coverage tooling added (document in Operating Model).
4. **Optimistic UI** — update badge on click; revert on API failure; toast via fixed DOM element.

## Risks / Trade-offs

- Collapsible rows increase DOM complexity — acceptable for analyst efficiency (FDS-12).
