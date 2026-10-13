# Agentic Development Lifecycle

This is the default process for changing Burdocks. Its purpose is to make small,
safe changes without accumulating large, agent-written planning documents.

## Workflow

1. **Frame**
   - Use the `frame-task-specification` skill.
   - State the player or administrator outcome.
   - Define observable acceptance criteria, non-goals, constraints, and open
     product decisions.
   - Do not choose product behavior on the user's behalf.

2. **Shape**
   - Use the `shape-implementation-plan` skill.
   - Inspect the relevant code and documentation.
   - Record the smallest implementation plan: affected boundaries, data or
     permission changes, tests, and operational impact.
   - Ask for a decision only when an unresolved product or durable technical
     choice blocks progress.

3. **Implement**
   - Use the `implement-shaped-task` skill.
   - Create a dedicated branch. `main` receives merges only.
   - Keep the change cohesive and add behavioral tests with the code.
   - Update documentation only when a durable decision, operation, or
     architecture changes.

4. **Review**
   - Review tests first, then the complete diff.
   - Focus on correctness, authorization, data safety, regressions, and
     verification rather than style preferences.
   - Fix actionable findings on the same branch.

5. **Verify And Release**
   - Run the relevant `mise` checks and manual UI checks.
   - Open a pull request, wait for CI, then merge and deploy the immutable
     image.
   - Health-check the deployment and record any follow-up work.

## Task Records

Create `docs/tasks/<phase>-<slug>.md` for a new behavior, data change,
permission change, or architectural decision. Do not create one for a trivial
fix, dependency-only update, or documentation-only change.

```md
# [Task name]

## Outcome
What changes for the player or administrator?

## Acceptance
- Observable condition

## Non-goals
- Explicitly excluded work

## Decisions
- Product or durable technical decision, with a short reason

## Plan
- Affected modules, data, permissions, tests, and rollout concerns

## Verification
- Commands and manual checks actually performed
```

Keep task records concise. They preserve decisions and evidence; they do not
duplicate source code or narrate routine work.

## Working Agreements

- Agents may make reversible implementation decisions independently.
- Agents ask before inventing player-facing rules, progression, content, or
  irreversible data behavior.
- Authentication, authorization, schema migrations, time behavior, scheduling,
  caching, and deployment changes always need explicit acceptance criteria.
- Pull requests are the code-review and release record. Task documents preserve
  product context that must outlive a pull request.

## Definition Of Done

A task is done when its acceptance criteria are met, relevant tests and checks
pass, the change has been reviewed, operational documentation is current, and
the deployed application is healthy when deployment is in scope.
