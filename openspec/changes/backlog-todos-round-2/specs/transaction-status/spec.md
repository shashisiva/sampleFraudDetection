## ADDED Requirements

### Requirement: PATCH requires status field in body

The system SHALL return 400 when `PATCH /transactions/:id/status` body omits the `status` property.

#### Scenario: Missing status key

- **WHEN** an authenticated client sends `PATCH /transactions/:id/status` with body `{}`
- **THEN** the response status is 400
