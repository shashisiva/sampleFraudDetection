## ADDED Requirements

### Requirement: Analyst can log in and receive JWT

The system SHALL expose `POST /auth/login` accepting credentials and returning a JWT plus a user object on success.

#### Scenario: Valid credentials

- **WHEN** the client sends valid email and password to `POST /auth/login`
- **THEN** the response status is 200
- **THEN** the response body includes a JWT string and a user object (id, email or username)

#### Scenario: Invalid credentials

- **WHEN** the client sends invalid credentials to `POST /auth/login`
- **THEN** the response status is 401
- **THEN** no JWT is returned

### Requirement: Protected routes require JWT

The system SHALL require a valid JWT on every API route except `POST /auth/login`.

#### Scenario: Missing token on protected route

- **WHEN** a client calls `GET /transactions` without an `Authorization: Bearer` token
- **THEN** the response status is 401

#### Scenario: Valid token on protected route

- **WHEN** a client calls a protected route with a valid JWT
- **THEN** the request proceeds to the route handler
