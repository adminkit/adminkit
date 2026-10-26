# AdminKit

Free Bootstrap 5 admin template, published to npm as `@adminkit/core`.

## Commands

- `npm ci` installs dependencies and the lefthook git hooks
- `npm start` serves `static/` on http://localhost:8080 and rebuilds on change
- `npm run build` builds `src/` into `dist/` and copies it into `static/`
- `npm run lint` runs ESLint and `prettier --check`
- `npm run format` runs `prettier --write`

## Layout

- `src/js` and `src/scss` are the source. Webpack builds them into `dist/` (gitignored); a production build copies `dist/` into `static/`.
- `static/` holds the committed demo site: HTML pages plus the built `css`, `js`, `img` and `fonts`. Do not hand-edit the built assets.
- The HTML pages are generated from the separate adminkit-builder repo; `_builder/` is untracked here. Phase 1 of the 2026 plan moves the page sources into this repo.
- `src/js/modules/vector-maps/` is vendored jsvectormap data and is excluded from ESLint and Prettier.

## Conventions

- Commits follow Conventional Commits; see `CONTRIBUTING.md` for types, scopes and examples. lefthook enforces them.
- A PR that changes behaviour adds a line under `Unreleased` in `CHANGELOG.md`. Add it, or ask before opening the PR.
