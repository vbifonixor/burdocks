# Burdocks Agent Guide

Read `docs/README.md`, the current task document, and every `CONTEXT.md` that
governs files you plan to change before changing application behavior. The
closest applicable context takes precedence.

Use Mise as the command interface:

- `mise run dev` starts development.
- `mise run lint` checks formatting, linting, and TypeScript.
- `mise run test` runs unit and browser tests.
- `mise run build` builds production output.
- `mise run db:migrate` migrates SQLite and bootstraps the configured admin.
- `mise run db:backup` writes a backup through the running Docker container.

Do not commit `mise.local.toml`, database files, test artifacts, or secrets. Update concise documentation when changing architecture, operations, or a task decision.
