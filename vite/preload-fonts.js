// Preloads the built font files whose names match `pattern` from every page, so text
// renders in them from the first paint. css/app.css loads Inter with font-display:
// optional; without the preload a slow first load could keep the fallback font.
export default function preloadFonts(pattern) {
  return {
    name: "adminkit-preload-fonts",
    apply: "build",
    transformIndexHtml: {
      order: "post",
      handler(_html, { bundle }) {
        return Object.values(bundle ?? {})
          .filter(
            (file) =>
              file.type === "asset" &&
              file.fileName.endsWith(".woff2") &&
              pattern.test(file.fileName)
          )
          .map((file) => ({
            tag: "link",
            attrs: {
              rel: "preload",
              href: `./${file.fileName}`,
              as: "font",
              type: "font/woff2",
              crossorigin: true,
            },
            injectTo: "head",
          }));
      },
    },
  };
}
