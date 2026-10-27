# AdminKit

Free Bootstrap 5 admin template, published to npm as `@adminkit/core`.

## Commands

- `npm ci` installs dependencies and the lefthook git hooks
- `npm run dev` serves the pages on http://localhost:8080 and reloads on change (`npm start` also opens the browser)
- `npm run build` builds everything into `dist/`; `npm run preview` serves that build
- `npm run lint` runs ESLint, `prettier --check`, `scripts/check-icons.mjs`, which fails unless `src/js/modules/icons.js` imports exactly the Lucide icons the templates use, and `scripts/stats.mjs --check`, which fails when `src/data/stats.json` or the README block is stale
- `npm run icons:list` regenerates `src/data/icons-lucide.json` (every Lucide icon with its search tags) from `lucide-static`; run it after upgrading `lucide`
- `npm run format` runs `prettier --write`
- `npm run stats` regenerates `src/data/stats.json` and the README block between `<!-- stats:start -->` and `<!-- stats:end -->` (see Counts below)
- `npm run stats:sync -- --pro ../adminkit-pro` copies a PRO checkout's committed `src/data/stats.json` to `src/data/editions/pro.json`, then runs `npm run stats`. Run it whenever PRO's pages, plugins or icons change, and before every release
- `npm run screenshots -- --pro ../adminkit-pro` builds and serves a PRO checkout and writes the upgrade page screenshots to `public/img/screenshots/pro/`; `npm run screenshots -- --free` writes the README screenshots to `.github/screenshots/`. On demand only, never in the build; it needs Playwright's Chromium (`npx playwright install chromium`). Keep the PRO set under about 2 MB

## Layout

- `vite.config.js` is the build: a Vite multi-page app with `src/pages` as root. `vite/` holds the small in-repo plugins (Handlebars frontmatter and layouts, HTML beautifier).
- `src/pages/*.html` are Handlebars page templates with YAML frontmatter (`layout`, `title`, `name`, `active`, `meta_description`; `label` names a page without a `title` in the stats, and `category: dashboard` marks dashboards). String values may hold Handlebars expressions, rendered with the global data (`meta_description: "... {{formatNumber stats.icons.lucide}} icons"`). `src/layouts`, `src/partials` and `src/scripts` (inline page scripts) are Handlebars partials; `src/helpers` are the Handlebars helpers and `src/data` the global template data.
- `src/js` and `src/scss` are the JavaScript and Sass sources, built to `js/app.js` and `css/app.css`; `js/icons-all.js` holds every Lucide icon and is loaded by the icons page only. `src/js/modules/*.js` wrap the third-party plugins (Chart.js 4, SimpleBar 6, jsVectorMap, Vanilla Calendar Pro, Lucide icons) and expose the globals the inline page scripts use. Keep those output names; the templates and the npm package (`@adminkit/core`, `files: ["dist"]`) reference them.
- Icons are Lucide: markup is `<i data-lucide="<canonical name>"></i>` (canonical names from https://lucide.dev/icons/, not deprecated aliases such as `home`), styled through `.lucide` in `src/scss/3-components/_lucide.scss`. A new icon must be imported and added to `icons` in `src/js/modules/icons.js`, or `npm run lint` fails. `js/icons-all.js` is built from `lucide-static/icon-nodes.json` so it shares no chunk with `js/app.js`, which must stay one self-contained file for the npm package.
- Color modes: `css/app.css` serves light and dark; `data-bs-theme` on `<html>` picks the mode, set before the first paint by the inline script in `src/partials/site-meta.hbs` and changed afterwards only through `src/js/modules/color-mode.js` (`adminkit_config_colorMode` in localStorage: `light`, `dark`, `auto`). Dark values are `$*-dark` variables in `src/scss/1-variables/_dark.scss`. A component color that follows the mode uses a custom property (`var(--bs-gray-200)`, `var(--ak-surface-bg)`, `var(--bs-body-color)`; `--bs-gray-*` and `--bs-secondary`/`--bs-light`/`--bs-dark` turn around in dark mode, see `3-components/_root.scss`); where a component needs a different color in dark mode, add an `@include color-mode(dark) { ... }` block at the end of its partial. Check both modes.
- Sidebar (`src/js/modules/sidebar.js`): `#sidebar` is a Bootstrap `.offcanvas-lg`. Below lg the navbar toggle opens it as a sheet; from lg up it hides and shows it (`.collapsed`). AdminKit PRO shares this code path and switches to its compact layout instead.
- Charts and maps: `window.theme` (`src/js/modules/theme.js`) holds the colors of the current mode and `adminkit:themechange` announces changes. Inline page scripts create charts with `adminkit.chartjs("#id", function(theme) { return config; })` and maps with `adminkit.vectorMap(function(theme) { return options; })`; the function is called again with the new colors when the mode changes, so read colors from its `theme` argument, never from `window.theme` captured outside it.
- `public/` is copied verbatim into `dist/` (`img/`, including the PRO screenshots in `img/screenshots/pro/` that the upgrade page shows). The README screenshots live in `.github/screenshots/`, outside the build.
- `dist/` is the build output and is gitignored. Vercel builds it with `npm run build`.
- `src/js/modules/vector-maps/` is vendored jsvectormap data and is excluded from ESLint and Prettier.

## Counts

- Every page, dashboard, plugin and icon count in `src/` and the README comes from `src/data/stats.json`, which `scripts/stats.mjs` generates and which is committed so it shows in diffs and works without a build. Templates read it as `{{stats.pages.count}}`, `{{stats.icons.lucide}}` and so on, and PRO's as `{{editions.pro.pages.count}}`; format numbers with `{{formatNumber ...}}`. Never type a count by hand.
- Sources: the pages and their frontmatter, `src/data/plugins.json` (`name`, `package`, `url`, `license` per third-party plugin; a dependency that is not a plugin goes in `notPlugins` with the reason), `src/data/icons-lucide.json` and `src/data/appearance.json` (the color modes, which `js/modules/color-mode.js` imports, and the one sidebar color scheme, a constant here). A new dependency fails lint until it is in one of the two lists.
- `src/data/comparison.json` holds this edition's column of the AdminKit and AdminKit PRO comparison: per row an `id`, a `label` and a `value`, either a stat path (`{ "stat": "pages.count" }`) or a literal. PRO's repository has the same rows with PRO's values. `npm run stats` resolves them into `stats.json` → `comparison` and adds PRO's column from the snapshot, matched by `id`; a row missing on either side fails. The upgrade page and the README table read it.
- PRO's numbers come from the committed snapshot `src/data/editions/pro.json` (the same shape as PRO's `stats.json`), never from the PRO repository at build time. Refresh it with `npm run stats:sync -- --pro <PRO checkout>` after PRO's pages, plugins or icons change and before every release, and commit it.
- The build regenerates `stats.json` (`vite/stats.js`) so `dist/` is never stale; commit the result.

## Motion and loading states

- Tokens: `$ak-transition-duration-fast|base|slow` and `$ak-transition-easing-standard|emphasized` in `src/scss/1-variables/_app.scss`, used as `var(--ak-duration-*)` and `var(--ak-ease-*)`. Write transitions with Bootstrap's `@include transition(...)` so reduced motion turns them off; an animation must not move anything under `prefers-reduced-motion: reduce` (a fade is fine).
- Reveal (`js/modules/reveal.js`, `3-components/_reveal.scss`): every top-level `.card` inside `.ak-reveal-cards` (the layouts put it on `<main>`, which itself fades in once the page scripts have run) and every `.ak-reveal` element fades up when it scrolls into view. The hidden state only applies under `html.js-reveal`, set by the inline script in `site-meta.hbs`; nothing else is needed on a new page.
- Count-up (`js/modules/count-up.js`): `data-count-up` on an element that holds only a number (with any prefix, suffix, `,` separators and decimals) and sits on its own line. The text stays the final value for screen readers and reduced motion.
- Skeletons (`js/modules/skeleton.js`, `3-components/_skeleton.scss`): for content JavaScript draws, put `aria-busy="true"` on the card body and `{{> skeleton }}` inside a `position-relative` element that has the content's final height (a `.chart` or a `min-height`). `adminkit.chartjs()` and `adminkit.vectorMap()` clear it; for anything else call `adminkit.ready(element)`. All of them fire `adminkit:ready`.
- Clickable cards: `a.card` or a card with a `.stretched-link` lifts on hover and focus; nothing to add.
- Layout shift must stay 0: reserve the final size of anything a script draws, give images `width` and `height`, and keep `<i data-lucide>` icons sized through the rules in `_lucide.scss` (component rules that size an icon list `i[data-lucide]` next to `svg`/`.lucide`).
- These modules must stay importable into the single `js/app.js` bundle: no dynamic imports and nothing that splits a chunk.

## Accessibility

- Target: WCAG 2.2 AA in light and dark mode, on every page including the sidebar and navbar: 4.5:1 for text, 3:1 for large text, icons and controls, no serious or critical axe violations.
- Check with `@axe-core/playwright` on the built pages in both modes.
- A new color that text or a control is drawn in must pass: use `ak-readable($color, $background)` (`src/scss/1-variables/_functions.scss`) and `$theme-text-colors` / `$theme-text-colors-dark` for theme colors as text; fills with white text must reach 4.5:1 (`ak-text-on()` picks white or dark text).
- Icon-only links and buttons get an `aria-label`; links that act as buttons get `role="button"`; card titles are `h2.card-title` under the page's `h1`.

## Conventions

- Commits follow Conventional Commits; see `CONTRIBUTING.md` for types, scopes and examples. lefthook enforces them.
- A PR that changes behaviour adds a line under `Unreleased` in `CHANGELOG.md`. Add it, or ask before opening the PR.
