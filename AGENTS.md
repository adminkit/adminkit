# AdminKit

Free Bootstrap 5 admin template, published to npm as `@adminkit/core`.

## Commands

- `npm run dev`: dev server on http://localhost:8080
- `npm run build`: build into `dist/`; `npm run preview` serves it
- `npm run lint`: ESLint, Prettier, the icon check and the stats check; must pass
- `npm run format`: Prettier write
- `npm run stats`: regenerate `src/data/stats.json` and the README counts
- `npm run stats:sync -- --pro ../adminkit-pro`: refresh PRO's counts; run it before every release

## Layout

- `src/pages/*.html` are Handlebars pages with YAML frontmatter; `src/layouts` and `src/partials` are partials, `src/helpers` helpers, `src/data` global data.
- `src/js` and `src/scss` build to `js/app.js` and `css/app.css`. Keep the output names: the pages and the npm package use them. `js/app.js` stays one self-contained file (no dynamic imports, no chunks); `src/types/app.d.ts` types its globals.
- `src/js/head.js` is a blocking script in `<head>`: it sets the color mode before the first paint and must not import anything.

## Rules

- Only CSS custom properties get a prefix: `--ak-*`, like Bootstrap's `--bs-*`. Classes, Sass variables, functions and mixins never do.
- Light and dark mode: colors that follow the mode use custom properties (`var(--bs-body-color)`, `var(--ak-surface-bg)`); dark-only overrides go in `@include color-mode(dark) { ... }` at the end of the partial. Check both modes.
- Icons are Lucide, `<i data-lucide="name"></i>` with canonical names from lucide.dev. Add a new icon to `src/js/modules/icons.js`, or lint fails.
- Page scripts go in `{{#push "scripts"}}` at the end of the page or of the widget's partial, inside `DOMContentLoaded`. Charts and maps use `adminkit.chartjs("#id", function(theme) { ... })` and `adminkit.vectorMap(...)`; read colors from `theme`.
- JavaScript that enhances markup registers it with `mount(selector, setup)` (`src/js/modules/mount.js`), so markup added later works too.
- Counts come from `src/data/stats.json` (`{{formatNumber stats.pages.count}}`). Never type a count by hand.
- Motion: write transitions with `@include transition(...)`; under reduced motion nothing moves (a fade is fine). Cards inside `.reveal-cards` and `.reveal` elements fade in on scroll without extra code.
- Layout shift stays 0: reserve the final size of anything a script draws (`{{> skeleton }}`), give images `width` and `height`.
- Accessibility: WCAG 2.2 AA in both modes. Text colors come from `readable($color, $background)`, text on a fill from `text-on($background)`. Icon-only buttons get an `aria-label`; card titles are `h2.card-title`.

## Conventions

- Conventional Commits, see `CONTRIBUTING.md`; lefthook enforces them.
- A PR that changes behaviour adds a short, user-facing line under `Unreleased` in `CHANGELOG.md`, like "Add pricing page (/pages-pricing.html)" or "Upgrade dependencies".
