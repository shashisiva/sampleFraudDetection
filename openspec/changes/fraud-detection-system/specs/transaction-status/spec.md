## ADDED Requirements

### Requirement: Analyst can mark transaction as Fraud or Legitimate

The system SHALL expose `PATCH /transactions/:id/status` allowing an authenticated analyst to set status to `fraud` or `legitimate`.

#### Scenario: Mark as fraud

- **WHEN** an authenticated analyst sends `PATCH /transactions/:id/status` with body `{ "status": "fraud" }`
- **THEN** the transaction status is updated to fraud
- **THEN** the response status is 200 with the updated transaction

#### Scenario: Mark as legitimate

- **WHEN** an authenticated analyst sends `PATCH /transactions/:id/status` with body `{ "status": "legitimate" }`
- **THEN** the transaction status is updated to legitimate
- **THEN** the response status is 200 with the updated transaction

#### Scenario: Invalid status rejected

- **WHEN** an authenticated analyst sends a status other than `fraud` or `legitimate`
- **THEN** the response status is 400

#### Scenario: Unknown transaction

- **WHEN** an authenticated analyst patches a non-existent transaction id
- **THEN** the response status is 404

#### Scenario: Unauthenticated status update rejected

- **WHEN** an unauthenticated client sends `PATCH /transactions/:id/status`
- **THEN** the response status is 401
