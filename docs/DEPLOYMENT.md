# Deployment

Life Radar is a static, client-rendered single-page app — once built, `dist/` can be served by any static web server or CDN. There is no server-side component to deploy.

## CI/CD (GitHub Actions)

CI/CD runs on GitHub Actions, under `.github/workflows/`:

- **`ci.yml`** — runs on every push and pull request. Installs dependencies and runs `npm run quality` (lint + unit tests with coverage).
- **`e2e.yml`** — runs on push to `master`. Boots the dev server and runs the Cypress suite via `run_e2e_tests.sh`.
- **`deploy.yml`** — runs on push to `master`. Builds and deploys the production bundle to [Vercel](#vercel) using the Vercel CLI.
- **`docker-publish.yml`** — runs on push to `master`. Builds and pushes the Docker image via `docker_push.sh`.

All four workflows are independent and run in parallel; nothing currently gates `deploy.yml`/`docker-publish.yml` on `ci.yml`/`e2e.yml` passing first. If you want a stricter gate, add `needs: [...]` between jobs or use GitHub's branch protection / required-status-checks settings on `master` instead.

### Required GitHub secrets

Set these under the repo's **Settings → Secrets and variables → Actions**:

| Secret                             | Used by              | Purpose                                                                       |
| ---------------------------------- | -------------------- | ----------------------------------------------------------------------------- |
| `VERCEL_TOKEN`                     | `deploy.yml`         | Vercel CLI authentication                                                     |
| `VERCEL_ORG_ID`                    | `deploy.yml`         | Vercel org/team ID (`vercel link` or the project's Vercel dashboard settings) |
| `VERCEL_PROJECT_ID`                | `deploy.yml`         | Vercel project ID                                                             |
| `DEV_API_KEY`, `TESTING_CLIENT_ID` | `e2e.yml`            | Google API key / OAuth client ID used by the e2e suite                        |
| `DOCKER_USER`, `DOCKER_PASS`       | `docker-publish.yml` | Docker Hub credentials                                                        |

## Vercel

The project deploys to [Vercel](https://vercel.com) as a static build, configured by `vercel.json`:

```json
{
  "buildCommand": "npm run build:prod",
  "outputDirectory": "dist"
}
```

### One-time setup

1. Create a Vercel project (via the Vercel dashboard, "Import Project", pointing at this GitHub repo — or `vercel link` locally) **without** enabling Vercel's own GitHub auto-deploy integration, since deploys are driven by `deploy.yml` instead.
2. From the Vercel dashboard, grab the project's Org ID and Project ID (Project Settings → General), and create a personal/CI access token (Account Settings → Tokens).
3. Add `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID` as GitHub Actions secrets (see table above).
4. Set any required build-time environment variables (`CLIENT_ID`, `API_KEY`, `GTM_ID`, `ENVIRONMENT=production`) as Vercel project environment variables, since `npm run build:prod` reads them from the environment during the Vercel build step.

### Manual/local deploy

```bash
npm install -g vercel
vercel pull --yes --environment=production --token=<your token>
vercel build --prod --token=<your token>
vercel deploy --prebuilt --prod --token=<your token>
```

### Preview deployments

To get a preview deployment per pull request, either:

- Enable Vercel's native Git integration for this repo (Vercel will then auto-deploy preview builds for PRs independently of `deploy.yml`), or
- Add a second workflow triggered on `pull_request` that runs the same `vercel build`/`vercel deploy --prebuilt` steps without `--prod`.

## Docker

The included `Dockerfile` builds the app and serves it via nginx — useful for self-hosting outside Vercel, or for local development in a container.

```bash
docker build -t life-radar .
docker run -p 80:80 life-radar
```

What it does:

1. Installs Node 16 and npm dependencies on top of `nginx:1.23.0`.
2. At container start, `build_and_start_nginx.sh` runs `npm run build:prod`, copies the output of `dist/` into `/opt/build-your-own-radar`, copies `default.template` to nginx's `conf.d/default.conf`, and starts nginx.
3. Local end-to-end test fixtures (`spec/end_to_end_tests/resources/localfiles/*`) are also copied in under `files/`, so CSV/JSON sample data is servable from the same container for demos/e2e runs.

A `.devcontainer/devcontainer.json` is provided so the same `Dockerfile` can be used as a VS Code Dev Container for local development.

`docker_push.sh` (invoked by `.github/workflows/docker-publish.yml`) builds and pushes the image to Docker Hub, tagged as both `:latest` and `:<first 8 chars of the commit sha>`, to `wwwthoughtworks/build-your-own-radar` — update this repo name in the script if you publish under your own Docker Hub account/org.

## Deploying to any other static host

Since the build output is static files, `dist/` (from `npm run build:prod`) can be deployed to any static host — Netlify, GitHub Pages, S3 + CloudFront, nginx/Apache, etc. Two things to set at build time regardless of host:

- `ENVIRONMENT=production` (selects feature toggles, see `src/config.js`)
- `CLIENT_ID` / `API_KEY` (for Google Sheets OAuth/API access, see `src/util/googleAuth.js`) if you intend to support Google Sheets as a data source. CSV/JSON data sources don't require either.

## Self-hosting checklist

- [ ] Decide on a data source strategy (Google Sheet vs. hosted CSV/JSON — see [EXTENDING.md](EXTENDING.md))
- [ ] If using Google Sheets, register an OAuth client ID and set `CLIENT_ID`/`API_KEY` as build environment variables
- [ ] Set up the Vercel project and GitHub secrets (or choose an alternate static host)
- [ ] Push to `master` and confirm `deploy.yml` succeeds
- [ ] Point users at `https://<your-deployment>/?sheetId=<your data source URL>`
