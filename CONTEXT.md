# Architecture Context

These rules govern implementation until a closer `CONTEXT.md` overrides them.
Apply them incrementally; do not refactor existing code merely to match a
target folder layout.

## Boundaries

- `app/routes/` is the React Router page and request boundary. Route modules
  compose UI, loaders, and actions; they do not own durable game rules.
- Root `server/` hosts Hono and runtime wiring. Feature-specific server work
  belongs with its owning feature or entity in a `server/` segment or
  `*.server.ts` module.
- Code reachable from the browser must never import server-only modules.
- Game rules belong in plain, runtime-independent TypeScript whenever possible.
  Keep React, HTTP, database, and authentication details at their boundaries.

## Slices And Dependencies

When a real concept needs its own home, use this dependency direction:

```text
routes -> features -> entities -> shared
```

- A **feature** is an action a player or administrator can take.
- An **entity** is a stable domain concept with behavior or state used by more
  than one feature.
- `shared/` contains only genuinely reusable primitives, not feature-specific
  helpers.
- A route may keep small, local behavior until extraction has a demonstrated
  benefit. Do not create slices, APIs, or abstractions speculatively.
- Segments such as `ui/`, `model/`, `server/`, and `lib/` are optional and
  exist only when their slice needs them.

## Data And Safety

- Keep `app/db/` as shared persistence infrastructure until a real entity owns
  a table or repository. Entity server modules may use it; pure models may not.
- Validate request and browser input at the authoritative server boundary.
- Scope protected reads and mutations to the authenticated owner. Authorization
  is never a client-only concern.
- Every persistent schema change needs a migration and a plan for existing
  data. Do not alter applied migrations.

## Implementation Defaults

- Prefer the smallest coherent change that satisfies the approved task.
- Reuse existing helpers and established patterns before adding a new one.
- Preserve user-visible behavior and data unless the task explicitly changes
  them.
- Add behavioral tests that fail for the regression being prevented.
