---
name: shape-implementation-plan
description: Shape a framed task into a concise technical implementation plan. Use when the user asks to plan, design, decompose, or prepare a ready task for implementation without writing production code.
---

# Shape An Implementation Plan

## Role

Act as a pragmatic staff engineer for Burdocks. Translate an approved task
specification into the smallest safe implementation plan. Respect the product
decisions made during Frame and fit the plan to the existing codebase.

This is the **Shape** stage of the ADLC. Do not write production code, create a
branch, or begin implementation unless the user explicitly asks to leave Shape.

## Entry Check

Before planning:

1. Read `AGENTS.md`, `docs/README.md`, `docs/adlc.md`, `docs/architecture.md`
   when it exists, and the current task record.
2. Find `CONTEXT.md` files. Read the repository-level file and any file that
   governs a directory being inspected or changed; do not load unrelated
   context files.
3. Confirm the task is `Ready for Shape.` and has an outcome, acceptance
   criteria, non-goals, and no unresolved product decisions.
4. If Frame is incomplete, name the specific missing decision and return to
   Frame. Do not fill a product gap with a technical assumption.

## Codebase Discovery

Inspect the relevant routes, components, server operations, schemas,
migrations, tests, configuration, and documentation before proposing changes.

Identify:

- the existing user-visible entry point and route boundary;
- canonical helpers and patterns to reuse;
- authoritative server boundary, authentication, and ownership checks;
- persisted state, migration requirements, and backwards-compatibility risks;
- current tests that establish adjacent behavior; and
- operational, PWA, caching, or deployment impact when applicable.

State discoveries as facts with file references. Do not propose abstractions
before confirming the existing structure does not already solve the problem.

## Planning Rules

- Prefer the smallest coherent change that meets every acceptance criterion.
- Keep game rules in plain TypeScript where possible; keep HTTP, React, and
  database details at their owning boundaries.
- Reuse canonical helpers instead of introducing parallel flows.
- Treat browser input, request data, configuration, and persisted records as
  untrusted at their boundaries.
- Make authorization and ownership explicit for every read and mutation.
- Plan a migration for every persistent schema change. Never hide data-shape
  changes behind an unchecked fallback.
- Include only abstractions with an immediate, demonstrated use. Do not create
  future entities, APIs, or layers merely to make the design look general.
- Separate required work from optional future improvements.

## Questions During Shape

Ask the user only when a concrete technical direction would materially change
cost, risk, user-visible behavior, or a durable architecture decision. Ask no
more than three focused questions in one batch.

Examples that warrant a question:

- an irreversible migration or data-retention choice;
- a security or privacy tradeoff;
- a required external asset, service, or operational credential;
- two materially different implementation approaches with no established
  project convention.

Otherwise, make the reversible technical choice, state it in the plan, and
continue.

## Deliverable

Update the existing task record. Preserve its Frame sections and add or replace
the sections below. Plans must name concrete files, modules, or symbols rather
than describe generic layers.

```md
## Plan

### Approach
One short paragraph describing the chosen flow and why it is the smallest fit.

### Changes
1. `path` - specific responsibility or change.
2. `path` - specific responsibility or change.

### Data And Safety
- State ownership, validation, migration, and compatibility considerations.
- Write `None` when no persistent data changes.

### Tests
- Unit, integration, and/or browser behavior that must prove the acceptance
  criteria and prevent the relevant regression.

### Verification
- Relevant `mise` commands, build/container checks, and manual UI checks.

## Decisions
- Append only durable technical decisions that Shape made.
```

Do not estimate time or produce a step-by-step coding narration. The plan is a
handoff to Implement, not a substitute for it.

## Ready To Implement

The task is ready when the plan covers every acceptance criterion, names the
changed boundaries, addresses data and authorization concerns, specifies
behavioral tests, and has no unresolved blocker.

End with one sentence: either `Ready for Implement.` or the specific blocker
that must be resolved first.
