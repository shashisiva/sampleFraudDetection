## ADDED Requirements

### Requirement: Status change creates audit entry

The system SHALL create an audit log entry whenever a transaction status is changed via `PATCH /transactions/:id/status`.

#### Scenario: Audit entry on mark fraud

- **WHEN** an analyst marks a transaction as fraud
- **THEN** a row is inserted into `audit_log` with transaction id, analyst identity, timestamp, and action indicating fraud marking

#### Scenario: Audit entry on mark legitimate

- **WHEN** an analyst marks a transaction as legitimate
- **THEN** a row is inserted into `audit_log` with transaction id, analyst identity, timestamp, and action indicating legitimate marking

### Requirement: Analyst can view full audit history for a transaction

The system SHALL expose `GET /transactions/:id/history` returning the ordered audit trail for one transaction.

#### Scenario: History shows who and when

- **WHEN** an authenticated analyst requests `GET /transactions/:id/history` for a transaction with prior marks
- **THEN** the response lists audit entries in chronological order
- **THEN** each entry includes who performed the action and when it occurred

#### Scenario: History for unknown transaction

- **WHEN** an authenticated analyst requests history for a non-existent id
- **THEN** the response status is 404

#### Scenario: Unauthenticated history request rejected

- **WHEN** an unauthenticated client requests `GET /transactions/:id/history`
- **THEN** the response status is 401
