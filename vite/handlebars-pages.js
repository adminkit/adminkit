// Adds what vite-plugin-handlebars lacks: YAML frontmatter and layouts. Before that
// plugin compiles a page, this one parses the frontmatter, keeps it as the page's
// context and wraps the body in a partial block for the layout it names, so
// `{{> @partial-block }}` in the layout receives the page. The layout directory is
// registered as a partial directory alongside the others.
import { basename } from "node:path";
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

  return [
    {
      name: "handlebars-pages",
      configureServer(server) {
        // Layouts and partials live outside the Vite root, so watch them and reload on change
        const directories = [layoutDirectory, ...partialDirectory];
        server.watcher.add(directories);
        server.watcher.on("change", (file) => {
          const changed = normalizePath(file);
          if (
            directories.some((dir) => changed.startsWith(normalizePath(dir)))
          ) {
            server.ws.send({ type: "full-reload" });
          }
        });
      },
      transformIndexHtml: {
        order: "pre",
        handler(html, ctx) {
          const page = matter(html);
          frontmatter.set(normalizePath(ctx.path), page.data);

          const layout = basename(page.data.layout ?? defaultLayout, ".hbs");
          return `{{#> ${layout}}}${page.content}{{/${layout}}}`;
        },
      },
    },
    handlebars({
      partialDirectory: [layoutDirectory, ...partialDirectory],
      helpers,
      compileOptions,
      context: (pagePath) => ({ ...data, ...frontmatter.get(pagePath) }),
    }),
  ];
}
