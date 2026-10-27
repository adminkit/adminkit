import { readdirSync } from "node:fs";
import { basename, extname, resolve } from "node:path";
import { defineConfig } from "vite";
import banner from "./vite/banner.js";
import beautifyHtml from "./vite/beautify-html.js";
import classicScript from "./vite/classic-script.js";
import handlebarsPages from "./vite/handlebars-pages.js";
import preloadFonts from "./vite/preload-fonts.js";
import stats from "./vite/stats.js";
import data from "./src/data/index.js";
import * as helpers from "./src/helpers/index.js";

const src = (path) => resolve(import.meta.dirname, "src", path);

const pages = Object.fromEntries(
  readdirSync(src("pages"))
    .filter((file) => extname(file) === ".html")
    .map((file) => [basename(file, ".html"), src(`pages/${file}`)])
);

const bundles = {
  app: src("js/app.js"),
  "icons-all": src("js/icons-all.js"),
};

for (const name of Object.keys(bundles)) {
  if (name in pages) {
    throw new Error(`src/pages/${name}.html clashes with the ${name} bundle`);
  }
}

const assetDirectories = {
  ".woff": "fonts",
  ".woff2": "fonts",
  ".ttf": "fonts",
  ".eot": "fonts",
  ".svg": "img",
  ".png": "img",
  ".jpg": "img",
  ".jpeg": "img",
  ".gif": "img",
};

// The stylesheet keeps its name (templates and the npm package reference css/app.css);
// fonts and images from different packages can share a basename, so they are hashed
const assetFileName = ({ names: [name] }) => {
  const extension = extname(name);
  if (extension === ".css") {
    return "css/[name][extname]";
  }
  return `${assetDirectories[extension] ?? "assets"}/[name]-[hash][extname]`;
};

export default defineConfig({
  root: src("pages"),
  publicDir: resolve(import.meta.dirname, "public"),
  base: "./",
  plugins: [
    stats(data),
    handlebarsPages({
      data,
      helpers: { ...helpers },
      layoutDirectory: src("layouts"),
      partialDirectory: [src("partials"), src("scripts")],
      compileOptions: { preventIndent: true },
    }),
    beautifyHtml(),
    // Inter's latin regular and semibold faces, which every page uses
    preloadFonts(/inter-latin-(400|600)-normal/),
    banner(
      "css/app.css",
      `/*!
 * AdminKit v${data.version} (https://adminkit.io/)
 * Copyright ${data.year} Paul Laros
 * Copyright ${data.year} AdminKit
 * Licensed under MIT (https://github.com/adminkit/adminkit/blob/master/LICENSE)
 */`
    ),
    classicScript(Object.keys(bundles)),
  ],
  resolve: {
    // Pages live in src/pages, so the dev server cannot reach ../js and ../scss by relative URL.
    // Templates use the output paths (/js/app.js, /css/app.css) and these map them to the sources.
    alias: [
      { find: /^\/js\//, replacement: `${src("js")}/` },
      { find: /^\/css\/app\.css/, replacement: src("scss/app.scss") },
    ],
  },
  css: {
    preprocessorOptions: {
      scss: {
        // Our own SCSS only triggers "import"; the rest comes from Bootstrap 5.3
        silenceDeprecations: [
          // @import: Bootstrap 5.3 has no @use entry point, so the whole tree still uses it
          "import",
          // red(), green(), blue() in Bootstrap's color-contrast()
          "color-functions",
          // mix(), map-get() and friends without a sass: module prefix in Bootstrap
          "global-builtin",
          // Sass if() in Bootstrap's mixins
          "if-function",
        ],
      },
    },
  },
  build: {
    outDir: resolve(import.meta.dirname, "dist"),
    emptyOutDir: true,
    assetsInlineLimit: 0,
    modulePreload: { polyfill: false },
    rolldownOptions: {
      input: { ...pages, ...bundles },
      output: {
        entryFileNames: "js/[name].js",
        chunkFileNames: "js/[name]-[hash].js",
        assetFileNames: assetFileName,
      },
    },
  },
  server: {
    port: 8080,
    strictPort: true,
  },
});
