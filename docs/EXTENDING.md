# Extending Life Radar

## Architecture overview

- `src/site.js` — entry point, wires up the input form / data loading flow (`GoogleSheetInput`, see `src/util/factory.js`).
- `src/util/factory.js` — decides which data source to use based on the `sheetId` query param (`.csv`, `.json`, or a `docs.google.com` URL), builds the radar, and renders the landing/loading/error states.
- `src/util/sheet.js`, `src/util/googleAuth.js` — Google Sheets API access and OAuth.
- `src/util/contentValidator.js`, `src/util/inputSanitizer.js` — validate and normalize raw rows into blip data.
- `src/models/{radar,sector,ring,blip}.js` — domain model. `Sector` replaces the upstream `Quadrant`.
- `src/util/ringCalculator.js` — computes ring placement/geometry.
- `src/graphing/radar.js` — D3-based rendering of the radar itself.
- `src/config.js` — environment-driven feature toggles.

## Data format

Whatever the source (Google Sheet, CSV, or JSON), each row/record needs these fields (see `src/util/contentValidator.js` for the enforced header set, and `test-data/LifeRadar-Vol1.csv` for a worked example):

| Column | Description |
|---|---|
| `name` | Label for the item/blip |
| `ring` | Which ring it belongs to, e.g. `Adopt`, `Trial`, `Assess`, `Hold` (max 4 distinct ring values per radar — see `MalformedDataError` / `TOO_MANY_RINGS` in `src/common.js`) |
| `sector` (was `quadrant` upstream) | Which of the 8 wellness sectors the item belongs to |
| `isNew` | `TRUE`/`FALSE` — whether to flag the blip as new |
| `description` | HTML description shown on click/hover, sanitized via `sanitize-html` |

CSV example:

```csv
name,ring,sector,isNew,description
Morning walk,Adopt,Physical,FALSE,<p>Daily 30 minute walk</p>
Meditation app,Trial,Spiritual,TRUE,<p>Trying a new app</p>
```

JSON example is the same shape as an array of objects with those keys.

## Adding or renaming sectors

Sectors are derived from the data itself — `src/common.js`'s `plotRadar` creates a `Sector` for each distinct `sector` value found in the input rows (capitalized via lodash). To change the 8 sectors:

1. Update your data source (sheet/CSV/JSON) to use the new sector names/values — no code change needed for simply adding/renaming/removing sectors, since the radar reflects whatever sector values are present in the data.
2. If the radar's background graphics (sector boundary lines, the wellness-wheel artwork) are sector-count-specific, check `src/graphing/radar.js` for any hardcoded geometry assuming exactly 8 sectors.
3. Update the README's sector list and the references section if the conceptual model itself changes.

## Adding or renaming rings

Rings are similarly derived from the `ring` column, in `src/common.js`. The hard limit is `maxRings = 4` (see `ExceptionMessages.TOO_MANY_RINGS`); a 5th distinct ring value in the data throws `MalformedDataError`. To support more rings, change `maxRings` in `src/common.js` and check `src/util/ringCalculator.js` for ring-count-dependent geometry.

## Feature toggles & environment config

`src/config.js` exposes per-environment feature toggles, selected by the `ENVIRONMENT` env var at build time:

```js
const config = {
  production: { featureToggles: { UIRefresh2022: false } },
  development: { featureToggles: { UIRefresh2022: true } },
}
```

Add new toggles here following the same pattern, and gate behavior in `src/site.js`/`src/common.js` with `config.featureToggles.<YourToggle>`.

## Theming / styling

Styles are SCSS under `src/stylesheets/`, split by concern (`_colors.scss`, `_layout.scss`, `_header.scss`, `_footer.scss`, `_form.scss`, `_herobanner.scss`, `_landingpage.scss`, `_mediaqueries.scss`, `_tip.scss`, `_loader.scss`, `_error.scss`, `_fonts.scss`), composed in `base.scss`. Update `_colors.scss` for a quick palette change; the radar's own SVG colors are set in `src/graphing/radar.js`.

## Adding a new data source type

Data source handling lives in `src/util/factory.js`'s `GoogleSheetInput.build`. It pattern-matches on the `sheetId` query param's suffix/domain. To add a new source type (e.g. a REST API):

1. Add a new branch in `GoogleSheetInput.build` to detect your source (by URL pattern, extension, etc.).
2. Implement a builder function following the `CSVDocument`/`JSONFile` pattern: fetch data, validate columns with `ContentValidator`, sanitize rows with `InputSanitizer`, then call `plotRadar(...)`.
3. Add unit tests under `spec/util/` and, if relevant, fixtures under `test-data/`.

## Extending validation/sanitization

`src/util/contentValidator.js` enforces required headers and basic structural correctness; `src/util/inputSanitizer.js` normalizes/escapes individual row values before they become `Blip`s. Extend these together if you add new required columns.
