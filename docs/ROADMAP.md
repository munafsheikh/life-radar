# Roadmap

## Where the project stands today

Life Radar has diverged from upstream Build Your Own Radar in the following ways (see git history for full detail):

- Refactored the 4-quadrant tech-radar model into an 8-sector wellness model (`Quadrant` → `Sector` across models, validators, and the renderer).
- Defined the 8 wellness sectors: physical, intellectual, emotional, social, spiritual, vocational, financial, environmental, grounded in published wellness-dimension research (see README references).
- Added sample wellness data (`test-data/LifeRadar-Vol1.csv`) alongside the original Thoughtworks tech radar sample, for testing/demo purposes.
- Carried over upstream's Google Sheet / CSV / JSON data source support and Docker packaging.
- Migrated CI/CD from CircleCI + AWS S3/CloudFront to GitHub Actions + Vercel (see [DEPLOYMENT.md](DEPLOYMENT.md)).
- UI styling/buttons pass to adapt the look and feel toward the wellness use case.

## Near-term plans

- [ ] Update on-page copy and the input form (`src/util/factory.js`'s `plotForm`) to reference wellness-radar language instead of the inherited "Build your own [tech] radar" copy.
- [ ] Decide whether the 4-ring model (`Adopt`/`Trial`/`Assess`/`Hold`) is the right framing for personal wellness tracking, or whether a wellness-specific ring vocabulary (e.g. `Thriving`/`Growing`/`Watching`/`Struggling`) better fits the domain — see `src/common.js`'s `maxRings` and ring-naming logic.
- [ ] Provide a ready-to-copy Google Sheet template for the 8-sector wellness format, replacing/augmenting the upstream tech-radar template link in the landing page copy.
- [ ] Audit `src/graphing/radar.js` for any quadrant-era geometry/labeling assumptions that don't fully generalize to 8 sectors (radial label placement, sector boundary styling).

## Medium-term plans

- [ ] Add a lightweight way to track radar snapshots over time (e.g. periodic CSV exports) so users can see how their wellness sectors shift, rather than only viewing a single point-in-time snapshot.
- [ ] Reduce the Google OAuth/Sheets dependency surface for users who only want local file (CSV/JSON) based tracking — consider a simpler "drag and drop a CSV" flow.
- [ ] Expand automated test coverage around the sector-rename refactor (`spec/models/sector-spec.js`, `spec/util/contentValidator-spec.js`) to lock in the 8-sector behavior as a regression guard.

## Longer-term / exploratory ideas

- [ ] Personal history/trends view, distinct from the single live radar (would require some form of persistence, which the project currently has none of by design).
- [ ] Guided onboarding for first-time users to fill in their own 8-sector data without needing to hand-edit a spreadsheet.
- [ ] Mobile-friendly interaction model for the radar visualization (currently desktop/SVG-hover oriented).

## How to propose roadmap changes

Open a GitHub issue describing the proposal and its motivation. If it's a significant architectural change (e.g. introducing persistence, changing the ring/sector model), please discuss before implementing — see [CONTRIBUTING.md](CONTRIBUTING.md).
