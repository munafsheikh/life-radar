[![CI](https://github.com/munafsheikh/life-radar/actions/workflows/ci.yml/badge.svg)](https://github.com/munafsheikh/life-radar/actions/workflows/ci.yml)
[![Stars](https://badgen.net/github/stars/thoughtworks/build-your-own-radar)](https://github.com/thoughtworks/build-your-own-radar)
[![dependencies Status](https://david-dm.org/thoughtworks/build-your-own-radar/status.svg)](https://david-dm.org/thoughtworks/build-your-own-radar)
[![devDependencies Status](https://david-dm.org/thoughtworks/build-your-own-radar/dev-status.svg)](https://david-dm.org/thoughtworks/build-your-own-radar?type=dev)
[![peerDependencies Status](https://david-dm.org/thoughtworks/build-your-own-radar/peer-status.svg)](https://david-dm.org/thoughtworks/build-your-own-radar?type=peer)
[![Docker Hub Pulls](https://img.shields.io/docker/pulls/wwwthoughtworks/build-your-own-radar.svg)](https://hub.docker.com/r/wwwthoughtworks/build-your-own-radar)
[![GitHub contributors](https://badgen.net/github/contributors/thoughtworks/build-your-own-radar?color=cyan)](https://github.com/thoughtworks/build-your-own-radar/graphs/contributors)
[![Prettier-Standard Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://github.com/sheerun/prettier-standard)
[![AGPL License](https://badgen.net/github/license/thoughtworks/build-your-own-radar)](https://github.com/thoughtworks/build-your-own-radar)

# Life Radar

Life Radar is an interactive radar visualization for tracking personal wellness across the **8 dimensions of well-being**. It is a fork of Thoughtworks' [Build Your Own Radar](https://github.com/thoughtworks/build-your-own-radar), with the original 4-quadrant "tech radar" model refactored into an 8-sector "wellness wheel".

The radar is rendered entirely client-side. Its production deployment loads data from a small Supabase project (read-only, no login required); the underlying app also still supports plotting from a Google Sheet, a hosted CSV, or a hosted JSON file via a `?sheetId=` query param, with no backend of its own required for that path — see [Data sources](#data-sources).

## Live

The production build is deployed on Vercel: **https://life-radar-munafsheikh-2582s-projects.vercel.app**

- `/` or `?dataset=personal` — the personal wellness radar
- `/?dataset=team` — a demo team-wellness radar
- `/?dataset=family` — a demo family-wellness radar

## Sectors

The radar is organized into 8 wellness sectors instead of the original 4 technology quadrants:

1. Physical
2. Intellectual
3. Emotional
4. Social
5. Spiritual
6. Vocational
7. Financial
8. Environmental

See [References](#references) for the wellness model this is based on.

Within each sector, items are plotted into one of 4 rings (e.g. `Adopt`, `Trial`, `Assess`, `Hold`), the same ring model used by the original tech radar, repurposed here to express how central a given habit/area is to your life right now.

## Data sources

The app picks a data source at page load, in this order (`src/util/factory.js`):

1. **`?sheetId=<url>`** — a hosted `.csv`, `.json`, or `docs.google.com` Google Sheet URL. No backend needed; the browser fetches it directly.
2. **Supabase** (used in production when no `sheetId` is given) — fetches from a `radar_entries` table filtered by `?dataset=personal|team|family` (default `personal`). Requires `SUPABASE_URL`/`SUPABASE_PUBLISHABLE_KEY` to be set at build time.
3. **Landing page form** — if neither of the above applies, shows the original "enter a sheet URL" form.

`data/*-radar.csv` is the human-edited source of truth for the Supabase datasets; a nightly job syncs it in. See [Deployment → Supabase data source](docs/DEPLOYMENT.md#supabase-data-source) for how that pipeline works and how to recover if the Supabase project is ever lost.

## Documentation

- [Build & Test](docs/BUILD_AND_TEST.md) — local setup, dev server, unit tests, e2e tests, linting
- [Deployment](docs/DEPLOYMENT.md) — Docker, CI/CD, static hosting, environment configuration
- [Extending Life Radar](docs/EXTENDING.md) — data formats, adding sectors/rings, theming, feature toggles
- [Contributing](docs/CONTRIBUTING.md) — workflow, code style, commit conventions
- [Roadmap](docs/ROADMAP.md) — planned and proposed future work

## Quick start

```bash
nvm use            # Node 22.x, see .nvmrc
npm install
npm run dev         # http://localhost:8080
```

Then visit the dev server URL with a `sheetId` query parameter pointing at a Google Sheet, CSV, or JSON file, e.g.:

```
http://localhost:8080/?sheetId=https://raw.githubusercontent.com/<you>/<repo>/main/test-data/LifeRadar-Vol1.csv
```

See [docs/EXTENDING.md](docs/EXTENDING.md) for the expected data shape. To run against Supabase locally instead, set `SUPABASE_URL`/`SUPABASE_PUBLISHABLE_KEY` (see `.env.example`) and load the dev server with no `sheetId`.

## Project status

Actively developed; the core radar (8 sectors × 4 rings, Google Sheet/CSV/JSON input) is stable and has been in production for a while. Current focus:

- **Production data source migrated to Supabase.** The deployed site now serves three datasets — `personal`, `team`, `family` — from a Supabase Postgres table instead of requiring visitors to bring their own sheet.
- **Supabase-archival mitigation shipped (2026-07-25).** Supabase's free tier auto-pauses/archives projects after a period of inactivity. Rather than migrate to a new project, `data/*-radar.csv` is now the source of truth and `.github/workflows/sync-data.yml` runs nightly to (a) upsert that data into Supabase — keeping the project active — and (b) redeploy production. **One-time setup still needed:** add `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` as GitHub Actions secrets (see [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md#required-github-secrets)) so the nightly workflow can authenticate — without them, `sync-data.yml` will fail until the secrets are added.
- **CI/CD**: GitHub Actions runs lint + unit tests + Playwright visual tests on every push (`ci.yml`), Cypress e2e on push to `master` (`e2e.yml`), and deploys to Vercel on push to `master` (`deploy.yml`), plus the nightly sync above.
- **Known gaps**, tracked in [docs/ROADMAP.md](docs/ROADMAP.md): landing-page copy/form still reads as the original tech-radar product for the no-`sheetId`/no-Supabase fallback path; no authenticated UI to edit `radar_entries` directly (edits go through `data/*-radar.csv` + the nightly sync); no historical/trend view across snapshots yet.

## Modifications from upstream

1. 4 Quadrants refactored to 8 Sectors (see above).
2. Sector and ring terminology updated throughout the codebase (`src/models/sector.js`, `src/util/ringCalculator.js`, etc.) to reflect the wellness domain rather than technology adoption.
3. Added a Supabase-backed data source (`personal`/`team`/`family` datasets) as the default for production, with a nightly sync pipeline from `data/*-radar.csv` — see [Data sources](#data-sources) and [Project status](#project-status).
4. Migrated CI/CD from CircleCI + AWS S3/CloudFront to GitHub Actions + Vercel.

## References

1. https://www.ncbi.nlm.nih.gov/pmc/articles/PMC5508938/#:~:text=Wellness%20encompasses%208%20mutually%20interdependent,Table%201)%20(1).
2. https://risecenter.ucla.edu/file/54de9fa0-c9b3-408b-b9a3-b50b710b4067
3. https://shcs.ucdavis.edu/health-and-wellness/eight-dimensions-wellness
4. https://www.csupueblo.edu/health-education-and-prevention/8-dimension-of-well-being.html

## License

AGPL-3.0, inherited from the upstream Build Your Own Radar project. See [LICENSE.md](LICENSE.md).
