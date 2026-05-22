## MODIFIED Requirements

### Requirement: Page displays hello world greeting

The system SHALL render a web page whose primary visible content is a heading that reads "Hello, World!" with "Shashi" appended at the end of the same heading text.

#### Scenario: User opens the page in a browser

- **WHEN** the user opens `index.html` in a web browser
- **THEN** the page displays an `<h1>` containing "Hello, World!" followed by "Shashi" at the end

#### Scenario: Greeting preserves hello world and appends name

- **WHEN** the page loads
- **THEN** the heading text SHALL read exactly `Hello, World! Shashi`
