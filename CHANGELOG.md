# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Changed

- Require Node 24 (`.nvmrc`, `engines`)
- Enforce Conventional Commits with commitlint and lefthook git hooks
- Replace ESLint 8 and babel-eslint with ESLint 9 flat config, add Prettier and `.editorconfig`
- Add GitHub Actions CI: lint, build and commitlint on pull requests and pushes to `main`
- Track `package-lock.json`
- Replace the committed Google Maps API key with a `YOUR_GOOGLE_MAPS_API_KEY` placeholder
- Replace webpack and Babel with a Vite 8 multi-page build and move the page sources from the separate adminkit-builder repo into `src/pages`, `src/layouts`, `src/partials` and `src/scripts`; images move to `public/img`
- Stop tracking the generated `static/` output; `npm run build` writes `dist/`, which Vercel, npm publishing and the GitHub release workflow build
- Load `js/app.js` as an ES module (`<script type="module">`)
- Attach a zip of the built template to GitHub releases on `v*` tags
- Upgrade Chart.js to 4 and rewrite the chart configs for its options API; bars get rounded tops
- Upgrade SimpleBar to 6
- Replace flatpickr with Vanilla Calendar Pro for the dashboard calendar
- Target the browsers Vite compiles for (Chrome and Edge 111, Firefox 114, Safari and iOS 16.4) and hash font and image assets
- Upgrade ESLint to 10

## [3.5.0] - 2026-08-01

- Upgrade to Webpack v5.109.2
- Upgrade to Bootstrap v5.3.8
- Upgrade dependencies

## [3.4.0] - 2023-06-08

- Add error catching to JavaScript modules
- Update browserslist
- Upgrade to Webpack v5.86.0
- Upgrade to Bootstrap v5.3.0
- Upgrade dependencies

## [3.3.0] - 2022-08-10

- Fix table in card styling issues
- Upgrade to Webpack v5.74.0
- Upgrade to Bootstrap v5.2.0
- Upgrade dependencies

## [3.2.0] - 2022-02-04

- Migrate to Dart Sass
- Upgrade to Webpack v5.68.0
- Upgrade to Bootstrap v5.1.3
- Upgrade dependencies

## [3.1.0] - 2021-09-29

- Replace OptimizeCssAssetsPlugin with CssMinimizerPlugin
- Remove HardSourceWebpackPlugin
- Upgrade to Webpack v5.55.1
- Upgrade to Bootstrap v5.1.1
- Upgrade dependencies

## [3.0.2] - 2021-05-19

- Add file structure to README.md
- Add icons to dashboard (/index.html)
- Add marketing page (/upgrade-to-pro.html)
- Remove unused sass files
- Remove unused dependencies
- Various visual changes
- Upgrade dependencies

## [3.0.1] - 2021-05-17

- Fix Simplebar bug on auth pages
- Upgrade to bootstrap@5.0.1
- Upgrade dependencies

## [3.0.0] - 2021-05-12

- Set Chart.js font family
- Remove Moment.js dependency
- Refactor sidebar JavaScript module
- Various visual changes
- Upgrade to bootstrap@5.0.0
- Upgrade dependencies

## [2.3.0] - 2021-04-05

- Add CDN to `README.md`
- Upgrade to bootstrap@5.0.0-beta3
- Upgrade dependencies

## [2.2.0] - 2021-02-25

- Replace Inter font with CDN
- Replace Font Awesome icons with Feather
- Optimize bundle size
- Bind `bootstrap` to window object
- Update .nvmrc file
- Upgrade to bootstrap@5.0.0-beta2
- Upgrade dependencies

## [2.1.0] - 2020-11-07

- Add Sign In page
- Add Sign Up page
- Replace `.close` with `.btn-close`
- Upgrade to bootstrap@5.0.0-alpha2
- Upgrade dependencies

## [2.0.1] - 2020-09-14

- Fix console error on auth pages (#6)
- Upgrade dependencies

## [2.0.0] - 2020-09-04

- Upgrade to Bootstrap 5
- Drop jQuery as dependency
- Replace jvectormap-next with jsvectormap
- Replace tempusdominus with flatpickr
- Upgrade dependencies

## [1.0.2] - 2020-07-26

- Fix issue with dropdown overflow on mobile
- Upgrade dependencies

## [1.0.1] - 2020-05-25

- Upgrade to latest Bootstrap (4.5.0)
- Upgrade dependencies

## [1.0.0] - 2020-03-21

- Initial release
