## Context

Existing static page displays `<h1>Hello, World!</h1>`. User request: modify in place and add "Shashi" to the end — not replace the greeting.

## Goals / Non-Goals

**Goals:**

- Append ` Shashi` to the existing `<h1>` text → `Hello, World! Shashi`
- No structural HTML or CSS changes

**Non-Goals:**

- Replacing "Hello, World!" with "Hello, Shashi!"
- Changing `<title>`, adding JavaScript, or new files

## Decisions

1. **Exact copy: `Hello, World! Shashi`**
   - **Rationale**: Preserves original hello world text; Shashi appears at the end as requested.
   - **Alternative**: comma before Shashi (`Hello, World!, Shashi`) — rejected; user said append to the end of existing text.

2. **Single-line `<h1>`**
   - **Rationale**: Simplest change; one string update.

## Risks / Trade-offs

None significant for this one-line change.

## Migration Plan

Edit one line in `index.html`. Rollback: remove ` Shashi` from the heading.

## Open Questions

None.
