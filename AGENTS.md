# AdminKit

Free Bootstrap 5 admin template, published to npm as `@adminkit/core`.

## Commands

- `npm ci` installs dependencies and the lefthook git hooks
- `npm run dev` serves the pages on http://localhost:8080 and reloads on change (`npm start` also opens the browser)
- `npm run build` builds everything into `dist/`; `npm run preview` serves that build
- `npm run lint` runs ESLint, `prettier --check` and `scripts/check-icons.mjs`, which fails unless `src/js/modules/icons.js` imports exactly the Lucide icons the templates use
- `npm run icons:list` regenerates `src/data/icons-lucide.json` (every Lucide icon with its search tags) from `lucide-static`; run it after upgrading `lucide`
- `npm run format` runs `prettier --write`

## Layout

- `vite.config.js` is the build: a Vite multi-page app with `src/pages` as root. `vite/` holds the small in-repo plugins (Handlebars frontmatter and layouts, HTML beautifier).
- `src/pages/*.html` are Handlebars page templates with YAML frontmatter (`layout`, `title`, `name`, `active`, `meta_description`). `src/layouts`, `src/partials` and `src/scripts` (inline page scripts) are Handlebars partials; `src/helpers` are the Handlebars helpers and `src/data` the global template data.
- `src/js` and `src/scss` are the JavaScript and Sass sources, built to `js/app.js` and `css/app.css`; `js/icons-all.js` holds every Lucide icon and is loaded by the icons page only. `src/js/modules/*.js` wrap the third-party plugins (Chart.js 4, SimpleBar 6, jsVectorMap, Vanilla Calendar Pro, Lucide icons) and expose the globals the inline page scripts use. Keep those output names; the templates and the npm package (`@adminkit/core`, `files: ["dist"]`) reference them.
- Icons are Lucide: markup is `<i data-lucide="<canonical name>"></i>` (canonical names from https://lucide.dev/icons/, not deprecated aliases such as `home`), styled through `.lucide` in `src/scss/3-components/_lucide.scss`. A new icon must be imported and added to `icons` in `src/js/modules/icons.js`, or `npm run lint` fails. `js/icons-all.js` is built from `lucide-static/icon-nodes.json` so it shares no chunk with `js/app.js`, which must stay one self-contained file for the npm package.
- `public/` is copied verbatim into `dist/` (`img/`).
- `dist/` is the build output and is gitignored. Vercel builds it with `npm run build`.
- `src/js/modules/vector-maps/` is vendored jsvectormap data and is excluded from ESLint and Prettier.

## Conventions

- Commits follow Conventional Commits; see `CONTRIBUTING.md` for types, scopes and examples. lefthook enforces them.
- A PR that changes behaviour adds a line under `Unreleased` in `CHANGELOG.md`. Add it, or ask before opening the PR.
