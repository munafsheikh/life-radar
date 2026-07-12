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

Data is plotted from a Google Sheet, a hosted CSV, or a hosted JSON file — there is no backend or database; the radar is rendered entirely in the browser from whatever data source you point it at.

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

## Documentation

- [Build & Test](docs/BUILD_AND_TEST.md) — local setup, dev server, unit tests, e2e tests, linting
- [Deployment](docs/DEPLOYMENT.md) — Docker, CI/CD, static hosting, environment configuration
- [Extending Life Radar](docs/EXTENDING.md) — data formats, adding sectors/rings, theming, feature toggles
- [Contributing](docs/CONTRIBUTING.md) — workflow, code style, commit conventions
- [Roadmap](docs/ROADMAP.md) — planned and proposed future work

## Quick start

```bash
nvm use            # Node 16.x, see .nvmrc
npm install
npm run dev         # http://localhost:8080
```

Then visit the dev server URL with a `sheetId` query parameter pointing at a Google Sheet, CSV, or JSON file, e.g.:

```
http://localhost:8080/?sheetId=https://raw.githubusercontent.com/<you>/<repo>/main/test-data/LifeRadar-Vol1.csv
```

See [docs/EXTENDING.md](docs/EXTENDING.md) for the expected data shape.

## Modifications from upstream

1. 4 Quadrants refactored to 8 Sectors (see above).
2. Sector and ring terminology updated throughout the codebase (`src/models/sector.js`, `src/util/ringCalculator.js`, etc.) to reflect the wellness domain rather than technology adoption.

## References

1. https://www.ncbi.nlm.nih.gov/pmc/articles/PMC5508938/#:~:text=Wellness%20encompasses%208%20mutually%20interdependent,Table%201)%20(1).
2. https://risecenter.ucla.edu/file/54de9fa0-c9b3-408b-b9a3-b50b710b4067
3. https://shcs.ucdavis.edu/health-and-wellness/eight-dimensions-wellness
4. https://www.csupueblo.edu/health-education-and-prevention/8-dimension-of-well-being.html

## License

AGPL-3.0, inherited from the upstream Build Your Own Radar project. See [LICENSE.md](LICENSE.md).
