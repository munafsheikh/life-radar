# Contributing

Thanks for considering a contribution to Life Radar. This is a fork of Thoughtworks' Build Your Own Radar, adapted for personal wellness tracking, and follows similar conventions to the upstream project.

## Getting set up

See [BUILD_AND_TEST.md](BUILD_AND_TEST.md) for environment setup, running the dev server, and running tests.

## Workflow

1. Fork/branch from `master`.
2. Make your change, with tests where it makes sense (see test layout in [BUILD_AND_TEST.md](BUILD_AND_TEST.md)).
3. Run `npm run quality` locally (lint + unit tests + coverage) before opening a PR — this is what CI gates on.
4. Run `npm run lint-prettier:fix` to auto-fix style issues rather than hand-formatting.
5. Open a pull request against `master` with a clear description of the change and why it's needed.
6. CI (the `CI` workflow, `.github/workflows/ci.yml`) must pass. Deployment to Vercel/Docker Hub only runs on pushes to `master` (see [DEPLOYMENT.md](DEPLOYMENT.md)) and is unaffected by feature branches/PRs.

## Code style

- ESLint (`standard` config, see `.eslintrc.json`) + Prettier (`.prettierrc`) — enforced by `npm run lint-prettier:check`.
- Editor defaults are in `.editorconfig`; most editors pick this up automatically.
- Keep modules consistent with existing patterns: factory-function-style constructors (`const Thing = function () { ... return self }`) are used throughout `src/models` and `src/util` rather than ES6 classes — match this when adding new modules in those directories.

## Commit messages

Write commit messages that explain _why_ a change was made, not just what changed. Keep the subject line short; use the body for context if needed.

## Tests

- New behavior in `src/models` or `src/util` should have a corresponding spec in `spec/models` or `spec/util`.
- UI/end-to-end behavior changes should be covered (or at least exercised) by the Cypress suite in `spec/end_to_end_tests`.
- Don't reduce coverage without a good reason — `npm run coverage` reports this locally.

## Reporting issues

Open a GitHub issue describing the problem or proposal. For bugs, include: steps to reproduce, expected vs. actual behavior, and the data source type involved (Google Sheet/CSV/JSON) if relevant, since each has separate code paths (`src/util/factory.js`).

## Contributors

See [CONTRIBUTORS.md](../CONTRIBUTORS.md) for the list of people who've contributed to this project and its upstream.
