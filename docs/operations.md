# Operations

Copy `mise.local.toml.example` to untracked `mise.local.toml` and replace every placeholder secret. `HOSTNAME` must be the public browser-facing origin.

Run `mise run db:migrate` before local development. Production startup performs the same migration and bootstrap automatically.

Docker Compose binds `./data` to `/data`; this contains `db.sqlite` and timestamped backups. Run `mise run db:backup` while the `app` service is running.

Build the image with `mise run container:build`. The container listens on `PORT` (default `3027`) for an external reverse proxy.
