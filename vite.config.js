import { readdirSync } from "node:fs";
import { basename, extname, resolve } from "node:path";
import { defineConfig } from "vite";
import beautifyHtml from "./vite/beautify-html.js";
import handlebarsPages from "./vite/handlebars-pages.js";
import data from "./src/data/index.js";
import * as helpers from "./src/helpers/index.js";

const src = (path) => resolve(import.meta.dirname, "src", path);

const pages = Object.fromEntries(
  readdirSync(src("pages"))
    .filter((file) => extname(file) === ".html")
    .map((file) => [basename(file, ".html"), src(`pages/${file}`)])
);

const assetDirectories = {
  ".css": "css",
  ".woff": "fonts",
  ".woff2": "fonts",
  ".ttf": "fonts",
  ".eot": "fonts",
  ".svg": "fonts",
  ".png": "img",
  ".jpg": "img",
  ".jpeg": "img",
  ".gif": "img",
};

export default defineConfig({
  root: src("pages"),
  publicDir: resolve(import.meta.dirname, "public"),
  base: "./",
  plugins: [
    handlebarsPages({
      data,
      helpers: { ...helpers },
      layoutDirectory: src("layouts"),
      partialDirectory: [src("partials"), src("scripts")],
      compileOptions: { preventIndent: true },
    }),
    beautifyHtml(),
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
      input: {
        ...pages,
        app: src("js/app.js"),
      },
      output: {
        entryFileNames: "js/[name].js",
        chunkFileNames: "js/[name]-[hash].js",
        assetFileNames: ({ names: [name] }) =>
          `${assetDirectories[extname(name)] ?? "assets"}/[name][extname]`,
      },
    },
  },
  server: {
    port: 8080,
    strictPort: true,
  },
});
