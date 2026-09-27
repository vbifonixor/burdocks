# Deployment

Deploy the private GHCR image to an Ubuntu VDS as one Docker container behind the host's HTTPS reverse proxy. Infrastructure configuration and Ansible playbooks live outside this repository.

## Server Setup

Install Docker Engine and the Docker Compose plugin. Create `/opt/burdocks/` and `/var/lib/burdocks/`.

Create `/opt/burdocks/compose.yml`:

```yaml
services:
  app:
    image: ghcr.io/vbifonixor/burdocks:${IMAGE_TAG}
    restart: unless-stopped
    env_file: .env
    environment:
      BACKUP_DIRECTORY: /data
      DATABASE_PATH: /data/db.sqlite
      PORT: 3027
    ports:
      - "127.0.0.1:3027:3027"
    volumes:
      - /var/lib/burdocks:/data
```

Create untracked `/opt/burdocks/.env`:

```dotenv
IMAGE_TAG=<commit-sha>
HOSTNAME=https://garden.example.com
AUTH_SECRET=<long-random-secret>
SU_EMAIL=<bootstrap-admin-email>
SU_PASSWORD=<strong-bootstrap-password>
```

`HOSTNAME` must be the exact public HTTPS origin. Never commit the `.env` file.

## Ansible Contract

The infrastructure playbooks should make the VDS ready to run the Compose file above.

- Install Docker Engine and the Docker Compose plugin.
- Create `/opt/burdocks/` and writable `/var/lib/burdocks/` directories.
- Install `/opt/burdocks/compose.yml` and a secret, mode `0600` `/opt/burdocks/.env`.
- Configure a GHCR credential with read access to the private `ghcr.io/vbifonixor/burdocks` package.
- Configure the HTTPS reverse proxy for `HOSTNAME` to proxy `127.0.0.1:3027`.
- Do not expose port `3027` beyond loopback.
- Ensure the reverse proxy starts before, and remains independent from, the application container.

The playbook receives `burdocks_image_tag` and writes it as `IMAGE_TAG` in `/opt/burdocks/.env`. It must accept only an immutable commit SHA, never a mutable tag such as `latest`.

## Registry Access

The package is private. Authenticate the VDS once with a GitHub fine-grained personal access token that can read the Burdocks package:

```sh
docker login ghcr.io
```

## Deploy And Update

From `/opt/burdocks/`, deploy a specific immutable commit-SHA image:

```sh
docker compose pull
docker compose up -d
curl --fail http://127.0.0.1:3027/ping
```

The application applies migrations and idempotently bootstraps the configured admin during startup.

To update, set `IMAGE_TAG` to the new commit SHA and repeat the commands above. To roll back, restore a previous SHA and repeat them.

## Deployment Automation

For now, deployments are manually triggered for a selected image SHA from `main`.

The future application-repository workflow accepts an `image_tag` input and sends a `repository_dispatch` event to the infrastructure repository:

```json
{
  "event_type": "burdocks-deploy",
  "client_payload": {
    "image_tag": "<commit-sha>"
  }
}
```

The infrastructure repository workflow listens for `burdocks-deploy`, validates that `image_tag` is a commit SHA, and invokes the Ansible deployment play with `burdocks_image_tag=<commit-sha>`.

The play must:

1. Back up `/var/lib/burdocks/db.sqlite` before replacement.
2. Update only `IMAGE_TAG` in `/opt/burdocks/.env`.
3. Run `docker compose pull` and `docker compose up -d` from `/opt/burdocks/`.
4. Poll `http://127.0.0.1:3027/ping` until it succeeds or times out.
5. Restore the previous image SHA and restart the Compose service if health verification fails.

The application repository needs a fine-grained GitHub token or GitHub App token stored as a secret. Its scope is limited to dispatching the infrastructure repository workflow; the standard repository `GITHUB_TOKEN` cannot normally dispatch to another private repository. GHCR read credentials and all application secrets remain in the infrastructure repository or on the VDS.

## Reverse Proxy And Data

Configure the host reverse proxy to terminate HTTPS for the public hostname and proxy to `http://127.0.0.1:3027`. Do not expose port `3027` publicly.

`/var/lib/burdocks/` persists the SQLite database and timestamped backups. Back it up before deployments.
