// Adds what vite-plugin-handlebars lacks: YAML frontmatter and layouts. Before that
// plugin compiles a page, this one parses the frontmatter, keeps it as the page's
// context and wraps the body in a partial block for the layout it names, so
// `{{> @partial-block }}` in the layout receives the page. The layout directory is
// registered as a partial directory alongside the others.
import { basename } from "node:path";
import Handlebars from "handlebars";
import matter from "gray-matter";
import handlebars from "vite-plugin-handlebars";
import { normalizePath } from "vite";

export default function handlebarsPages({
  data = {},
  layoutDirectory,
  partialDirectory = [],
  defaultLayout = "default",
  helpers,
  compileOptions,
}) {
  const frontmatter = new Map();

  // Frontmatter strings may use Handlebars expressions, such as a meta_description that
  // quotes {{formatNumber stats.icons.lucide}}; they render with the global data. The layout
  // escapes them where it outputs them.
  const strings = Handlebars.create();
  strings.registerHelper(helpers ?? {});
  const renderFrontmatter = (values) =>
    Object.fromEntries(
      Object.entries(values).map(([key, value]) => [
        key,
        typeof value === "string" && value.includes("{{")
          ? strings.compile(value, { noEscape: true })({ ...data, ...values })
          : value,
      ])
    );

  return [
    {
      name: "handlebars-pages",
      configureServer(server) {
        // Layouts and partials live outside the Vite root, so watch them and reload when one
        // changes, appears or disappears. vite-plugin-handlebars' own reload is switched off
        // below: it compares un-normalised paths and misses on Windows, and would double up here.
        const directories = [layoutDirectory, ...partialDirectory].map(
          normalizePath
        );
        server.watcher.add(directories);
        const reload = (file) => {
          const changed = normalizePath(file);
          if (directories.some((dir) => changed.startsWith(dir))) {
            server.ws.send({ type: "full-reload" });
          }
        };
        server.watcher.on("change", reload);
        server.watcher.on("add", reload);
        server.watcher.on("unlink", reload);
      },
      transformIndexHtml: {
        order: "pre",
        handler(html, ctx) {
          const page = matter(html);
          frontmatter.set(
            normalizePath(ctx.path),
            renderFrontmatter(page.data)
          );

          const layout = basename(page.data.layout ?? defaultLayout, ".hbs");
          return `{{#> ${layout}}}${page.content}{{/${layout}}}`;
        },
      },
    },
    handlebars({
      partialDirectory: [layoutDirectory, ...partialDirectory],
      reloadOnPartialChange: false,
      helpers,
      compileOptions,
      context: (pagePath) => ({ ...data, ...frontmatter.get(pagePath) }),
    }),
  ];
}
