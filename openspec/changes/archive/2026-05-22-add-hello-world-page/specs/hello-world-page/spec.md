## ADDED Requirements

### Requirement: Page displays hello world greeting

The system SHALL render a web page whose primary visible content is a heading that reads "Hello, World!".

#### Scenario: User opens the page in a browser

- **WHEN** the user opens `index.html` in a web browser
- **THEN** the page displays an `<h1>` (or equivalent heading) containing the text "Hello, World!"

### Requirement: Page is readable and minimally styled

The system SHALL apply basic styling so the greeting is legible and visually centered on typical desktop and mobile viewports.

#### Scenario: Greeting is centered on load

- **WHEN** the page loads without JavaScript errors
- **THEN** the greeting appears centered horizontally and vertically (or near-center) on the viewport

#### Scenario: Page has document title

- **WHEN** the user views the browser tab
- **THEN** the document title SHALL indicate a hello world page (e.g., "Hello World")

### Requirement: Local viewing instructions exist

The project SHALL include brief instructions for opening the page locally without a backend.

#### Scenario: Developer finds how to run the page

- **WHEN** a developer reads the project README (or change notes)
- **THEN** they find steps to open `index.html` directly or serve it with a simple static file server
