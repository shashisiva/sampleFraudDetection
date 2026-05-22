## ADDED Requirements

### Requirement: Analyst UI page for transaction review

The system SHALL provide `transactions.html` allowing an ops analyst to log in, view transactions, mark status, and view audit history.

#### Scenario: Login from UI

- **WHEN** the analyst opens `transactions.html` and submits valid credentials
- **THEN** the UI stores the JWT and displays the transaction list

#### Scenario: View paginated list in UI

- **WHEN** the analyst is authenticated
- **THEN** the UI displays transactions from `GET /transactions` sorted newest first
- **THEN** the UI supports navigating pages when more than 50 transactions exist

#### Scenario: Mark transaction from UI

- **WHEN** the analyst clicks to mark a transaction as Fraud or Legitimate
- **THEN** the UI calls `PATCH /transactions/:id/status` with the JWT
- **THEN** the list reflects the updated status on success

#### Scenario: View audit trail from UI

- **WHEN** the analyst selects a transaction to view history
- **THEN** the UI calls `GET /transactions/:id/history` and displays who marked the transaction and when in sequence

#### Scenario: UI handles auth errors

- **WHEN** the JWT is missing or expired
- **THEN** the UI prompts the analyst to log in again
