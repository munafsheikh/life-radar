# Build & Test

## Requirements

- Node.js `>=12 <18` (CI and `.nvmrc` pin `16.15.0` — use that unless you have a specific reason not to)
- npm `~8.3.1`

```bash
nvm use
npm install
```

## Running the app locally

```bash
npm run dev
```

Starts `webpack-dev-server` in development mode (`webpack.dev.js`) at `http://localhost:8080`. The dev build enables the `UIRefresh2022` feature toggle (see `src/config.js`).

The app does not ship any radar data by default — it expects a `sheetId` query parameter pointing at a Google Sheet URL, a `.csv` file, or a `.json` file (see [EXTENDING.md](EXTENDING.md#data-format)). Sample data lives in `test-data/`.

## Building for production

```bash
npm run build:dev    # development-mode bundle, webpack.dev.js
npm run build:prod   # production-mode bundle, webpack.prod.js, output to dist/
```

`API_KEY`, `CLIENT_ID`, and `GTM_ID` environment variables are read at build time (see `src/util/googleAuth.js`, `src/gtm.js`) and baked into the bundle. `ENVIRONMENT` (`development`/`production`) selects the feature-toggle set in `src/config.js`.

## Unit tests

Unit tests use [Jasmine](https://jasmine.github.io/) with jsdom, and live in `spec/`.

```bash
npm test
```

Test coverage (via [nyc](https://github.com/istanbuljs/nyc)):

```bash
npm run coverage
```

Combined lint + coverage check (what CI runs):

```bash
npm run quality
```

### Test layout

| Path                              | Covers                                                                                 |
| --------------------------------- | -------------------------------------------------------------------------------------- |
| `spec/models/*-spec.js`           | `Blip`, `Radar`, `Ring`, `Sector` models                                               |
| `spec/util/*-spec.js`             | `contentValidator`, `inputSanitizer`, `queryParamProcessor`, `ringCalculator`, `sheet` |
| `spec/graphing/ref-table-spec.js` | radar legend/reference table rendering                                                 |
| `spec/helpers/jsdom.js`           | jsdom environment setup for DOM-dependent specs                                        |

`package.json`'s `standard.ignore` list (`radar-spec.js`, `ref-table-spec.js`) excludes those two specs from the standard/eslint code-style check, since they contain intentionally unconventional test fixtures.

## End-to-end tests

E2E tests use [Cypress](https://www.cypress.io/) and live in `spec/end_to_end_tests/`.

```bash
npm run test:e2e          # requires TEST_URL env var pointing at a running instance
npm start                 # opens the Cypress runner interactively (TEST_URL, TEST_ENV)
```

`run_e2e_tests.sh` is what CI uses end-to-end: it boots the dev server in the background, waits for it to be ready, then runs the Cypress suite against it.

```bash
./run_e2e_tests.sh <API_KEY> <CLIENT_ID> <TEST_URL>
```

## Linting & formatting

The project uses ESLint (`standard` config flavor) + Prettier.

```bash
npm run lint-prettier:check   # CI check, no changes made
npm run lint-prettier:fix     # auto-fix in place
```

Run `lint-prettier:fix` before committing — `npm run quality` (and CI) fails on style violations.
