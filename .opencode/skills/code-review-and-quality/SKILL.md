---
name: code-review-and-quality
description: Code review, pull request review, and diff review guidance. Use when asked to review code written by a human or agent, assess a PR or diff, or evaluate quality before merging.
---

# Code Review And Quality

Review changes across correctness, readability, architecture, security, and
performance. Approve when a change clearly improves code health and follows
project conventions; do not demand perfection or substitute personal taste for
an actual engineering concern.

## Review Process

1. Establish the change's intent, expected behavior, relevant specification,
   and project conventions before judging the implementation.
2. Review tests first. Confirm they test behavior, include relevant edge and
   error cases, and would catch a regression.
3. Inspect every changed file using the five review axes below.
4. Check the verification story: tests, build, manual UI verification, and
   relevant before/after evidence.
5. Report only actionable, high-confidence findings, ordered by severity.
   Do not rubber-stamp a change or bury a real defect under cosmetic nits.

## Five Review Axes

### Correctness

- Confirm behavior matches the task or specification.
- Check empty, null, boundary, error, and concurrent/state-transition paths.
- Look for off-by-one errors, broken invariants, stale state, and tests that
  only exercise implementation details.

### Readability And Simplicity

- Prefer clear, consistent names and straightforward control flow.
- Flag unnecessary abstraction, dead code, compatibility shims, needless
  indirection, deeply nested flow, and cleverness that conceals intent.
- Avoid premature generalization. An abstraction should have a demonstrated
  purpose, not merely make a small change look reusable.
- Repeated conditionals often indicate a missing model or dispatcher. New
  conditionals bolted onto unrelated flows are a design concern, not a nit.

### Architecture

- Follow existing patterns unless a new pattern is justified.
- Keep feature-specific logic in its owning layer; do not leak it into shared
  modules or duplicate a canonical helper.
- Prefer changes that remove concepts, branches, or layers over refactors that
  just relocate the same complexity.
- Question unclear type boundaries, gratuitous casts, `any`, silent fallbacks,
  and optional values that hide an important invariant.

### Security

- Treat external input, API data, logs, content, and configuration as
  untrusted at boundaries.
- Check validation, authorization, secret handling, SQL parameterization,
  output encoding, and dependency provenance.
- Escalate security vulnerabilities as Critical.

### Performance

- Check for N+1 queries, unbounded fetches or loops, missing pagination,
  synchronous work on request/UI paths, unnecessary UI rerenders, and large
  allocations in hot paths.
- State expected impact when possible instead of making vague claims.

## Structural Remedies

When identifying structural debt, propose a specific simpler alternative:

- Replace conditional chains with a typed model or explicit dispatcher.
- Collapse duplicate branches into a single clear flow.
- Separate orchestration from business logic.
- Move feature logic to its owning module.
- Reuse the canonical helper.
- Make a type boundary explicit so downstream branching disappears.
- Delete a pass-through wrapper, or extract a focused helper/module.

Favor the remedy that removes moving parts instead of distributing complexity.

## Change Scope And Dependencies

Target small, cohesive changes. Rough guide: about 100 changed lines is easy
to review; 300 can be acceptable for one logical change; 1000 should normally
be split. Also inspect total file size: adding to an already large file may
require decomposition even for a small diff. Separate refactoring from new
behavior where practical.

For a dependency addition or upgrade, check whether the existing stack solves
the problem, maintenance status, size/bundle impact, vulnerabilities, license,
changelog or migration notes, lockfile diff, and test coverage. Avoid bulk
upgrades when individual changes can be isolated.

## Finding Format

Lead with findings, not a summary. Include a precise file and line reference,
explain the concrete consequence and the condition that triggers it, then
recommend a focused fix.

- **Critical:** Blocks merge: security vulnerability, data loss, or broken
  functionality.
- No prefix: Required before merge.
- **Optional:** or **Consider:** Useful but non-blocking improvement.
- **Nit:** Minor style or formatting preference.
- **FYI:** Informational only.

If there are no findings, state that explicitly and identify residual risks or
testing gaps. Do not invent concerns to appear thorough.

## Review Checklist

```markdown
## Review: [change title]

### Findings
- [severity] `path:line` - consequence, trigger, and suggested remedy

### Verification
- Tests: [run / not run / result]
- Build: [run / not run / result]
- Manual verification: [when applicable]

### Verdict
- Approve / Request changes
```

## Dead Code

After a refactor, identify newly unreachable or unused code. List it and ask
before deleting when its safety is uncertain; do not silently remove code that
may have an external use. Do not leave confirmed dead code behind.

## Review Conduct

- Technical facts, project style guidance, engineering principles, and
  codebase consistency outrank personal preference.
- Be direct about defects and gracious about informed author overrides.
- Do not accept "we will clean it up later" without a justified deferral.
- Comment on the code and its effects, never the author.
