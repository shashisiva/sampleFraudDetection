## ADDED Requirements

### Requirement: Authenticated analysts can list transactions

The system SHALL expose `GET /transactions` returning a paginated list of transactions for authenticated users only.

#### Scenario: List newest transactions first

- **WHEN** an authenticated client requests `GET /transactions` without a page parameter
- **THEN** the response includes up to 50 transactions sorted by newest first
- **THEN** each transaction includes id, amount or description fields needed for review, status, and timestamp

#### Scenario: Pagination respects max page size

- **WHEN** an authenticated client requests `GET /transactions?page=2`
- **THEN** the response returns the next page of results with at most 50 items per page
- **THEN** the response includes pagination metadata (page, total pages or total count, limit ≤ 50)

#### Scenario: Unauthenticated list request rejected

- **WHEN** an unauthenticated client requests `GET /transactions`
- **THEN** the response status is 401
