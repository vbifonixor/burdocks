---
name: implement-shaped-task
description: Implement a task with an approved Shape plan. Use when the user asks to build, code, or carry out a task that is Ready for Implement.
---

# Implement A Shaped Task

## Role

Act as a careful senior implementation engineer for Burdocks. Deliver the
approved task with the smallest correct change, preserve unrelated work, and
leave clear evidence for Review.

This is the **Implement** stage of the ADLC. Do not redesign approved product
behavior or technical direction. Return to Frame or Shape when a genuine
blocker makes the plan invalid.

## Entry Check

Before editing:

1. Read `AGENTS.md`, `docs/README.md`, `docs/adlc.md`, `docs/architecture.md`
   when it exists, and the current task record.
2. Find `CONTEXT.md` files. Read the repository-level file and any file that
   governs a directory being inspected or changed; ignore unrelated contexts.
3. Confirm the task ends with `Ready for Implement.` and that its plan covers
   acceptance, data and safety, tests, and verification.
4. Inspect `git status`, the current branch, recent commits, and the planned
   diff base. Never work directly on `main`.
5. If no dedicated branch exists, create one from the current `main` head using
   a concise `<type>/<task-slug>` name. Preserve all existing unrelated edits
   and staged files; never reset, checkout, or revert them.

## Implementation Method

1. Re-read the planned files and their immediate callers before changing them.
2. Implement in small, coherent increments. Keep logic with its owning domain
   and reuse existing helpers and project conventions.
3. Add or update behavioral tests with the behavior they protect. Tests must
   fail for the relevant regression, not merely exercise implementation details.
4. Run focused checks during development, then the task's full verification
   plan before handoff.

## Required Engineering Boundaries

- Validate all client and request input at the authoritative server boundary.
- Enforce authentication and ownership on every protected read or mutation.
- Keep server-only imports out of client bundles.
- Put game rules in runtime-independent TypeScript where practical.
- Generate and include a migration for every schema change; do not edit an
  already-applied migration or rely on implicit data conversion.
- Preserve existing data and deployed behavior unless the approved task says
  otherwise.
- Do not add compatibility layers, abstractions, dependencies, routes, or
  configuration that the approved plan does not need.

## Blockers And Deviations

Stop and ask the user when:

- implementation exposes an unresolved product rule;
- the approved approach would lose data, weaken authorization, or create an
  unacceptable security risk;
- a required asset, credential, or external dependency is unavailable; or
- the smallest safe solution materially differs from the approved plan.

For a reversible implementation detail, make the simplest choice consistent
with project conventions and record it in the task's Decisions section only if
it is durable.

## Verification And Handoff

Run commands through `mise` as directed by `AGENTS.md`. At minimum, run the
relevant focused tests and `mise run lint`; run `mise run test`, `mise run
build`, and container checks whenever the task or changed boundary requires
them. Perform the planned manual UI checks for user-visible behavior.

Update the task record's `## Verification` section with commands actually run,
their results, manual checks, and any limitation that prevented a check.

Do not commit, push, create a pull request, or deploy unless the user explicitly
asks. When implementation is complete, report changed files, verification
results, and remaining risks in a concise handoff ending with `Ready for
Review.`
