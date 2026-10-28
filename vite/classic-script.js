// js/app.js is published on npm and the CDN, where it is loaded with a plain
// <script src>. Vite emits ES module chunks whose top-level declarations would
// become globals in a classic script, so the self-contained bundles are wrapped
// in a function scope. They still work as <script type="module">.
// Frameworks also import js/app.js on the server while rendering a page, where
// there is no window: there the bundle does nothing. With no import or export
// it parses as a classic script, an ES module and a CommonJS module alike.
// js/head.js runs before the first paint, so it must stay one small file of its own.
export default function classicScript(names) {
  return {
    name: "classic-script",
    apply: "build",
    renderChunk(code, chunk) {
      if (!chunk.isEntry || !names.includes(chunk.name)) {
        return null;
      }
      if (chunk.imports.length > 0 || chunk.exports.length > 0) {
        throw new Error(
          `js/${chunk.name}.js must not import or export, or it cannot load as a classic script`
        );
      }
      if (
        chunk.name === "head" &&
        this.getModuleInfo(chunk.facadeModuleId).importedIds.length > 0
      ) {
        throw new Error("js/head.js must not import anything");
      }
      return {
        code: `(() => {\nif (typeof window === "undefined") return;\n${code}\n})();\n`,
        map: null,
      };
    },
  };
}
