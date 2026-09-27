# Phase 0 Implementation Plan

## Foundation

- Use npm with a committed lockfile and Node.js 24.21.0 managed by Mise.
- Use Biome for formatting and linting; do not add Prettier.
- Expose project commands through Mise: `dev`, `lint`, `build`, `test`, `container:build`, `db:migrate`, and `db:backup`.

## Runtime

- Run a single Hono Node server on `PORT`, defaulting to `3027`.
- Hono serves static assets, Better Auth, `/ping`, and forwards application requests to React Router's Fetch request handler.
- `HOSTNAME` is the complete public origin: `http://localhost:3027` in development and the HTTPS reverse-proxy origin in production.

## Data And Auth

- Store SQLite data at `/data/db.sqlite` in production and migrate at startup.
- Use Drizzle and Better Auth with email/password authentication and the admin plugin.
- Disable public registration. Bootstrap `SU_EMAIL` and `SU_PASSWORD` idempotently as an admin; never overwrite an existing account.
- Admins can create regular or admin accounts through `/admin`.

## Proof Of Work

- `/ping` is an unauthenticated health endpoint.
- `/sign-in` provides email/password authentication.
- `/` shows the signed-in user's grocery list.
- Use only unstyled semantic HTML. The list is a `<ul>`; `x` toggles completion, `d` deletes, and `e` turns item text into an input for editing.
- `/admin` is server-protected and creates accounts.
- Scope every grocery read and mutation to the authenticated user.

## PWA

- Generate all PNG icons from one source image using `@vite-pwa/assets-generator`.
- Cache only static build assets and icons with network-first, cache-fallback behavior.
- Never cache HTML navigations, backend/data requests, or authentication responses.
- Surface failed backend requests through the application error boundary. Offline mutation queuing is out of scope.

## Quality And Delivery

- Use Vitest for unit/integration tests and Playwright with one isolated application server and SQLite database per worker.
- Test accounts are created using normal bootstrap and admin flows, not direct test database writes.
- Run Biome checks on pre-commit and all tests on pre-push.
- Build one Docker image, mount `/data`, and provide SQLite-consistent timestamped backups through `mise db:backup`.
- Run checks and an image build on pull requests. On `main`, publish a private commit-SHA-tagged image to `ghcr.io/vbifonixor/burdocks` using `GITHUB_TOKEN` with package write permission.
