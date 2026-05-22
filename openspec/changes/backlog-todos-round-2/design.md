## Context

Second backlog pass after `backlog-todos-sprint`. Focus on measurable acceptance criteria (coverage, API edge cases) and documentation so `/opsx:propose` does not re-plan completed stories.

## Goals / Non-Goals

**Goals:**

- Add `npm run test:coverage` with thresholds (global 70%, transactionService 80%)
- Extend API tests for missing `status` and empty audit array
- Publish `openspec/backlog-implementation-status.md` with per-FDS status

**Non-Goals:**

- New UI features or API endpoints
- Automatic Excel write-back

## Decisions

1. **Coverage via Jest** — `collectCoverageFrom` on `src/services/**` and `src/routes/**`; CI runs `npm run test:coverage`.
2. **Backlog status doc** — single markdown table maintained in repo; export script optional footer linking to it.
3. **Skip re-implementation** — items marked Done in status doc when sprint 1 + fraud-detection-system cover AC.

## Risks / Trade-offs

- Coverage thresholds may fail CI until baselines met — set thresholds at current measured levels first, then ratchet.
