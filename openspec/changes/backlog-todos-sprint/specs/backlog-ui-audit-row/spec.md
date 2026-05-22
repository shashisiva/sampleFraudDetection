## ADDED Requirements

### Requirement: Collapsible row audit trail

The UI SHALL expand an audit panel below a transaction row when the row is activated, fetching history only on first expand.

#### Scenario: Expand row loads history

- **WHEN** the analyst expands a transaction row
- **THEN** the UI calls `GET /transactions/:id/history` and displays entries with analyst, status, and formatted timestamp
