## ADDED Requirements

### Requirement: Empty audit history returns empty array

The system SHALL return HTTP 200 with `{ history: [] }` when a transaction exists but has no audit entries.

#### Scenario: No audit entries yet

- **WHEN** an authenticated client requests `GET /transactions/:id/history` for a transaction with no audit rows
- **THEN** the response status is 200 and `history` is an empty array
