# Setup: fully working PWA on our chosen stack

Our first order of business would be creating the app shell itself. Basically, a hello world with CI/CD set up already - so that we can actually start thinking about what the app should contain in phase 1.

Should include:

1. Basic configuration for all of our tooling
2. Proof-of-work application with everything tied up together - not as a whole app but as just a more elaborate "hello world" that happens to try out the whole variety of stuff in our stack
3. Lints, e2e tests, typescript tests, diagnostics baked into it.
4. Deployment container setup - the application should be ready to run behind an external reverse proxy as a Docker container with everything it needs
5. Github actions configured to run sensible things on pull requests (status checks with lints, tests and everything)
6. Github actions that build and push the container when changes are merged to `main`
7. Local DX tooling for ease of maintainability. LLM-friendly and documented
8. AGENTS.md pointing to docs directory and docs about what this app consists of (not much so far)

## 1. Basic configuration

We'll be building this app on this stack:

- Node.js 24.21.0 as the backend
- React as a UI library
- PWA with a manifest and generated placeholder PNG icons for iOS, iPadOS, and Android. Cache only static build assets and icons with a network-first, cache-fallback service worker. Never cache HTML navigations, React Router data/API requests, or auth responses. Backend fetch failures are handled by an application error boundary that shows an alert.
- React Router (framework mode) as an app router
- SQLite database - the app is for two users only, so it's sufficient
- Drizzle as an ORM
- Better Auth
- No UI components library for now, that will be decided in the next phase of the MVP
- vite for building
- Vitest for TypeScript unit and integration tests
- playwright for e2e tests
- Hono is the Node backend server. It serves static assets, Better Auth, and application endpoints, and forwards application requests to React Router's Fetch request handler. Everything lives in one Docker container, listening on `PORT`, which defaults to `3027`.
- biome as a linter with sensible defaults
- The latest TypeScript supported by the pinned dependency lockfile

Everything should be working together in an application that is defined in the next subsection

## 2. Proof of work

The app should be a basic hello world with:

- authentication. Public signup is disabled. The idempotent bootstrap admin uses `SU_EMAIL`, `SU_PASSWORD`, `AUTH_SECRET`, and `HOSTNAME`; it must never overwrite an existing account. `HOSTNAME` is the complete browser-facing origin, including protocol and the development port, for example `http://localhost:3027`; production omits the port because it runs behind the reverse proxy. Admins can create further regular or admin email/password accounts through `/admin`.
- basic CRUD for a single database collection. Make it a grocery list with a status so users can cross out bought items. Use unstyled, semantic HTML only: an unordered list, with `x` to cross out, `d` to delete, and `e` to edit; editing replaces the item text with an input. Every server-side read and mutation must be scoped to the authenticated owner.
- Couple of routes (/ping, /admin, /)
- installable PWA with static assets available offline; offline CRUD is out of scope

## 3. CI stuff (points 3 through 7)

- Tooling configured with sensible defaults. Husky git hook for pre-commit with lint-staged (that runs all the lints), tests should be running on pre-push
- For tests:
  - Each Playwright worker starts an isolated application server with a unique port and temporary SQLite database. The application bootstraps a temporary initial admin through its normal startup flow; tests create further accounts through `/admin`, never through test-only database writes. Its database, reports, and other test artifacts are removed after its test run.
  - We define page objects that allow us to write declarative tests and worry about the actions' and checks' implementations while building them
  - There is one declarative e2e-style test that goes through logging in, adding items, crossing one out, deleting another, and logging off; it includes a negative authorization check that one user cannot access another user's item by ID.
- One application Dockerfile and Docker Compose setup, with `/data` mounted for persistent data. SQLite is stored at `/data/db.sqlite`; migrations run at startup. `mise db:backup` creates a SQLite-consistent timestamped backup in `/data`.
- Github actions are written to run:
  - checks for lint and tests on `pull_request`
  - checks, container build, and a commit-SHA-tagged image push to the private `ghcr.io/vbifonixor/burdocks` package on `push` to `main`. The workflow uses `GITHUB_TOKEN` with `contents: read` and `packages: write` permissions.

## 4. DX and ADLC stuff

- every script is defined in mise.toml and all the tooling is available via mise for reproducibility of local environment. Initial tasks are `dev`, `lint`, `build`, `test`, and `container:build`; add tasks when they are needed.
- secrets are controlled by untracked, gitignored `mise.local.toml`; commit `mise.local.toml.example` without secrets. The application fails clearly at startup when required production variables are missing.
- CI also uses mise for consistency
- We want to define some basic AGENTS.md. Nothing too fancy for now, just some words about how the project works now and how to work with it.
