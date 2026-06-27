# Deployment

Life Radar is a static, client-rendered single-page app — once built, `dist/` can be served by any static web server or CDN. There is no server-side component to deploy.

## Docker

The included `Dockerfile` builds the app and serves it via nginx.

```bash
docker build -t life-radar .
docker run -p 80:80 life-radar
```

What it does:
1. Installs Node 16 and npm dependencies on top of `nginx:1.23.0`.
2. At container start, `build_and_start_nginx.sh` runs `npm run build:prod`, copies the output of `dist/` into `/opt/build-your-own-radar`, copies `default.template` to nginx's `conf.d/default.conf`, and starts nginx.
3. Local end-to-end test fixtures (`spec/end_to_end_tests/resources/localfiles/*`) are also copied in under `files/`, so CSV/JSON sample data is servable from the same container for demos/e2e runs.

A `.devcontainer/devcontainer.json` is provided so the same `Dockerfile` can be used as a VS Code Dev Container for local development.

## Publishing the Docker image

`docker_push.sh` builds and pushes the image to Docker Hub:

```bash
DOCKER_USER=... DOCKER_PASS=... CIRCLE_SHA1=<sha> ./docker_push.sh
```

It tags the image as both `:latest` and `:<first 8 chars of the commit sha>` and pushes both tags to `wwwthoughtworks/build-your-own-radar` (update this repo name if you publish under your own Docker Hub account/org).

## CI/CD (CircleCI)

CI is configured with two files, using CircleCI's dynamic config ("continuation") feature:

- **`.circleci/config.yml`** — entry point for every push. Runs `tests` (`npm run quality`: lint + unit tests with coverage). If the trigger is not a pull request, it continues into `deployment-workflow.yml`.
- **`.circleci/deployment-workflow.yml`** — runs only on `master` (non-PR) builds:
  1. `e2e-tests` — Cypress suite against a local dev server.
  2. `approve-dev-deployment` — **manual approval gate**.
  3. `dev-deployment` — builds with dev credentials/feature flags and syncs `dist/` to an S3 bucket, then invalidates the corresponding CloudFront distribution.
  4. `approve-prod-deployment` — **manual approval gate**.
  5. `prod-deployment` — same S3/CloudFront flow with prod credentials, then builds and pushes the Docker image via `docker_push.sh`.

Required CircleCI environment variables/contexts (set these in the CircleCI project settings, not in source):

| Variable | Used for |
|---|---|
| `DEV_CLIENT_ID`, `DEV_GTM_ID`, `DEV_BUCKET_NAME`, `DEV_DISTRIBUTION_ID` | dev deployment build & S3/CloudFront target |
| `PROD_CLIENT_ID`, `PROD_GTM_ID`, `PROD_BUCKET_NAME`, `PROD_DISTRIBUTION_ID` | prod deployment build & S3/CloudFront target |
| `DEV_API_KEY`, `TESTING_CLIENT_ID`, `DEV_TEST_URL` | e2e test run against a live dev environment |
| `DOCKER_USER`, `DOCKER_PASS` | Docker Hub push |
| AWS credentials (consumed by the `aws-cli` orb) | S3 sync / CloudFront invalidation |

## Deploying to your own static host

Since the build output is static files, you can deploy `dist/` (from `npm run build:prod`) to any static host — S3 + CloudFront, GitHub Pages, Netlify, Vercel, nginx/Apache, etc. There's nothing CircleCI- or AWS-specific baked into the bundle itself; the CI workflow above is just the path this fork's maintainers chose.

Two things to set at build time regardless of host:
- `ENVIRONMENT=production` (selects feature toggles, see `src/config.js`)
- `CLIENT_ID` / `API_KEY` (for Google Sheets OAuth/API access, see `src/util/googleAuth.js`) if you intend to support Google Sheets as a data source. CSV/JSON data sources don't require either.

## Self-hosting checklist

- [ ] Decide on a data source strategy (Google Sheet vs. hosted CSV/JSON — see [EXTENDING.md](EXTENDING.md))
- [ ] If using Google Sheets, register an OAuth client ID and set `CLIENT_ID`/`API_KEY` at build time
- [ ] Run `npm run build:prod`
- [ ] Serve `dist/` from your static host or the provided Docker image
- [ ] Point users at `https://<your-host>/?sheetId=<your data source URL>`
