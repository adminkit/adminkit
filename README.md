<p align="center">
  <a href="https://github.com/adminkit/adminkit"><img src="https://adminkit.io/icons/icon-512x512.png" alt="AdminKit is a free & open-source HTML dashboard & admin template based on Bootstrap 5" width="96"></a>
</p>

<h3 align="center">AdminKit</h3>

<p align="center">
  AdminKit is a free & open-source HTML dashboard & admin template based on Bootstrap 5.
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/@adminkit/core" rel="nofollow"><img src="https://img.shields.io/npm/v/@adminkit/core" alt="NPM version"></a>
  <a href="https://github.com/adminkit/adminkit/blob/master/LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="License"></a>
  <a href="https://github.com/adminkit/adminkit/issues?q=is%3Aopen+is%3Aissue"><img src="https://img.shields.io/github/issues/adminkit/adminkit.svg" alt="GitHub issues open"></a>
  <a href="https://github.com/adminkit/adminkit/issues?q=is%3Aissue+is%3Aclosed"><img src="https://img.shields.io/github/issues-closed-raw/adminkit/adminkit.svg" alt="GitHub issues closed"></a>
  <a href="https://demo.adminkit.io/" rel="nofollow"><img src="https://img.shields.io/badge/demo-online-green.svg" alt="Live Demo"></a>
  <a href="https://adminkit.io/#download"><img src="https://img.shields.io/static/v1?label=download&message=ZIP&color=green" alt="Download"></a>
  <br>
<a href="https://github.com/adminkit/adminkit"><img alt="GitHub stars" src="https://img.shields.io/github/stars/adminkit/adminkit?style=social"></a>
</p>

## Preview

AdminKit is an admin and dashboard template built on Bootstrap 5, released under the MIT license. It needs no jQuery, and neither do the plugins it uses. It has light and dark mode and targets WCAG 2.2 AA in both. [Open the demo](https://demo.adminkit.io/).

<picture>
  <source media="(prefers-color-scheme: dark)" srcset=".github/screenshots/dashboard-dark.webp">
  <img src=".github/screenshots/dashboard-light.webp" width="1600" height="1000" alt="The AdminKit Analytics dashboard: visitors, page views, bounce rate and session duration, monthly visitors, browser usage, a calendar, a real-time visitors map, top pages and traffic sources">
</picture>

## AdminKit and AdminKit PRO

AdminKit PRO is the commercial edition, with more pages, dashboards and plugins, a settings panel and an AI chat. The table is generated from `src/data/stats.json` and the PRO snapshot in `src/data/editions/pro.json`; the template's Upgrade to Pro page (`upgrade-to-pro.html`) shows the same comparison with screenshots of AdminKit PRO, and [adminkit.io/pricing](https://adminkit.io/pricing/) has the prices and licenses.

<!-- stats:start -->

|                       | AdminKit      | [AdminKit PRO](https://adminkit.io/pricing/) |
| --------------------- | ------------- | -------------------------------------------- |
| Pages                 | 20            | 53                                           |
| Dashboards            | 1             | 5                                            |
| Plugins               | 4             | 11                                           |
| Icons                 | 1,908         | 4,071                                        |
| Sidebar color schemes | 1             | 3                                            |
| Dark mode             | Yes           | Yes                                          |
| AI chat               | No            | Yes                                          |
| Settings panel        | No            | Yes                                          |
| Support               | GitHub issues | Email                                        |
| License               | MIT           | Commercial                                   |

<!-- stats:end -->

## Quick start

You need Node.js 24 (see `.nvmrc`). Clone the repository, install the dependencies and start the development server on http://localhost:8080:

```sh
git clone --depth 1 https://github.com/adminkit/adminkit.git my-admin && cd my-admin && npm ci && npm run dev
```

The server reloads when you change a page, partial, stylesheet or script. Build the production files into `dist/`, the HTML pages, `css/app.css`, `js/app.js`, `fonts/` and `img/`, ready to deploy or copy into your own project:

```sh
npm run build
```

`npm run preview` serves that build. You can also [download the repository as a zip](https://github.com/adminkit/adminkit/archive/master.zip) or [from the website](https://adminkit.io/#download).

## npm and CDN

The built CSS and JavaScript are published to npm as [`@adminkit/core`](https://www.npmjs.com/package/@adminkit/core):

```sh
npm install @adminkit/core
```

The same files are on the unpkg CDN. `js/app.js` is a plain script, so it needs no build step or `type="module"`:

```html
<script src="https://unpkg.com/@adminkit/core@latest/dist/js/head.js"></script>
<link
  rel="stylesheet"
  href="https://unpkg.com/@adminkit/core@latest/dist/css/app.css"
/>
<script src="https://unpkg.com/@adminkit/core@latest/dist/js/app.js"></script>
```

Pin an exact version instead of `@latest` in production. The script adds `window.bootstrap`, `window.adminkit`, `window.lucide`, `window.theme`, `window.Chart`, `window.jsVectorMap` and `window.VanillaCalendar`.

## Frameworks

AdminKit is plain HTML, CSS and JavaScript, so it works with any back end or front-end framework. The documentation has a setup guide for each of these:

- [HTML](https://adminkit.io/docs/frameworks/html/)
- [Laravel](https://adminkit.io/docs/frameworks/laravel/)
- [Django](https://adminkit.io/docs/frameworks/django/)
- [Rails](https://adminkit.io/docs/frameworks/rails/)
- [Symfony](https://adminkit.io/docs/frameworks/symfony/)
- [React](https://adminkit.io/docs/frameworks/react/)
- [Next.js](https://adminkit.io/docs/frameworks/nextjs/)
- [Vue](https://adminkit.io/docs/frameworks/vue/)
- [Nuxt](https://adminkit.io/docs/frameworks/nuxt/)
- [Angular](https://adminkit.io/docs/frameworks/angular/)
- [SvelteKit](https://adminkit.io/docs/frameworks/sveltekit/)
- [Astro](https://adminkit.io/docs/frameworks/astro/)

## Dark mode

`css/app.css` holds a light and a dark color mode, built on [Bootstrap's color modes](https://getbootstrap.com/docs/5.3/customize/color-modes/). Set `data-bs-theme="dark"` on `<html>` for dark mode, or on any other element for that part of the page. The navbar toggle switches between light, dark and auto (the operating system setting) and stores the choice in `localStorage` (`adminkit_config_colorMode`). To apply the stored mode before the first paint, load `js/head.js` in `<head>`, before the stylesheet, as a plain blocking script (no `defer` or `type="module"`):

```html
<script src="js/head.js"></script>
<link rel="stylesheet" href="css/app.css" />
```

It is a few hundred bytes, needs no `unsafe-inline` in a Content Security Policy and also hides the cards that fade in until `js/app.js` runs. Without it `js/app.js` still sets the mode, after the first paint.

In your own styles, use the custom properties for colors that follow the mode: Bootstrap's `--bs-*`, the gray scale `--bs-gray-100` to `--bs-gray-900` (which turns around in dark mode) and `--ak-surface-bg`, the background of cards, dropdowns and inputs. The dark values live in `src/scss/1-variables/_dark.scss`.

`window.theme` holds the theme colors of the current mode for charts and maps; `document` fires `adminkit:themechange` with the new colors when the mode changes. Charts and maps created with `adminkit.chartjs(element, theme => config)` and `adminkit.vectorMap(theme => options)` recolor themselves.

## Google Maps

The Google Maps page loads the Maps JavaScript API without an API key, so Google marks the maps "For development purposes only" and logs a `NoApiKeys` warning (and an `ApiProjectMapError` per map) in the console. For production, create a key in Google Cloud, restrict it by HTTP referrer and add `key=YOUR_KEY` to the script URL in `src/pages/maps-google.html`.

## File structure

The package contains the following directories and files:

```
adminkit/
├── .nvmrc
├── README.md
├── package.json
├── postcss.config.mjs
├── vite.config.js
├── public/
│   └── img/
├── scripts/
├── src/
│   ├── data/
│   ├── helpers/
│   ├── js/
│   │   ├── modules/
│   │   └── app.js
│   ├── layouts/
│   ├── pages/
│   ├── partials/
│   │   ├── charts/
│   │   └── dashboard/
│   └── scss/
│       ├── 1-variables/
│       ├── 2-mixins/
│       ├── 3-components/
│       ├── 4-utilities/
│       ├── 5-vendor/
│       └── app.scss
├── vite/
└── dist/
    ├── *.html
    ├── css/
    │   └── app.css
    ├── img/
    └── js/
        ├── app.js
        ├── head.js
        └── icons-all.js
```

`src/pages` holds one Handlebars template per page with YAML frontmatter; `src/layouts` and `src/partials` are the shared markup, with the chart and dashboard widgets in `src/partials/charts` and `src/partials/dashboard`; a page's inline script sits at the end of the page, a widget's script in the widget's partial. `public/` is copied to `dist/` as it is.

## Sidebar

From Bootstrap's lg breakpoint (992px) up, the navbar toggle hides and shows the sidebar. On smaller screens the sidebar is a Bootstrap offcanvas (`.offcanvas-lg` on `#sidebar`): the toggle opens it as a sheet over the page, Escape, the backdrop or a link close it, and focus stays inside while it is open.

## Motion

Cards fade up as they scroll into view (`.ak-reveal-cards` on `<main>`, `.ak-reveal` on anything else), stat numbers with `data-count-up` count up, charts animate in, and cards whose content JavaScript draws show a skeleton placeholder until it is ready. Durations and easings are the `--ak-duration-fast|base|slow` and `--ak-ease-standard|emphasized` custom properties (`$ak-transition-*` in Sass). With `prefers-reduced-motion: reduce` nothing moves: content only fades in, numbers and charts show their final state at once. The cards only fade in on pages that load `js/head.js`; without it the content shows at once.

## Accessibility

The template targets WCAG 2.2 AA in both color modes: 4.5:1 contrast for text, 3:1 for large text, icons and other controls, named controls and a logical heading order. Every page is checked in light and dark mode with axe (`@axe-core/playwright`), including the sidebar and navbar. New colors must pass too: derive text colors with `ak-readable($color, $background)` from `src/scss/1-variables/_functions.scss`, which darkens (or, on dark backgrounds, lightens) a color just enough, and use `$theme-text-colors` / `$theme-text-colors-dark` for theme colors drawn as text.

## Icons

AdminKit uses [Lucide](https://lucide.dev/icons/) icons: `<i data-lucide="house"></i>` becomes an inline SVG when the page loads. `js/app.js` only bundles the icons the templates use, listed in `src/js/modules/icons.js`. To use another icon, import it there and add it to `icons`; `npm run lint` fails when a template uses an icon that is not bundled, or the list bundles one that no template uses. After adding icon markup at runtime, render it with `lucide.createIcons({ icons: lucide.icons })`.

The icons page loads `js/icons-all.js`, which holds every Lucide icon. Its icon list, `src/data/icons-lucide.json`, is generated from `lucide-static`; run `npm run icons:list` after upgrading `lucide` and `lucide-static`.

## Browser support

The build targets the browsers Vite calls "baseline widely available". The `browserslist` field in `package.json` lists the same set for Autoprefixer.

| <img src="https://assets.adminkit.io/browsers/edge.png" alt="Edge" width="24px" height="24px" /><br/>Edge | <img src="https://assets.adminkit.io/browsers/firefox.png" alt="Firefox" width="24px" height="24px" /><br/>Firefox | <img src="https://assets.adminkit.io/browsers/chrome.png" alt="Chrome" width="24px" height="24px" /><br/>Chrome | <img src="https://assets.adminkit.io/browsers/safari.png" alt="Safari" width="24px" height="24px" /><br/>Safari | <img src="https://assets.adminkit.io/browsers/safari-ios.png" alt="iOS Safari" width="24px" height="24px" /><br/>iOS Safari |
| --------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| 111+                                                                                                      | 114+                                                                                                               | 111+                                                                                                            | 16.4+                                                                                                           | 16.4+                                                                                                                       |

## Resources

- [Demo](https://demo.adminkit.io/)
- [Website](https://adminkit.io/)
- [Documentation](https://adminkit.io/docs)
- [Support](https://adminkit.io/support/)
- [Affiliate Program](https://adminkit.io/affiliate-program)

## Bugs and feature requests

To report a bug or request a feature, [open a new issue](https://github.com/adminkit/adminkit/issues/new).
