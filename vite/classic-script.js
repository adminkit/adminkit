// js/app.js is published on npm and the CDN, where it is loaded with a plain
// <script src>. Vite emits ES module chunks whose top-level declarations would
// become globals in a classic script, so the self-contained bundles are wrapped
// in a function scope. They still work as <script type="module">.
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
      return { code: `(() => {\n${code}\n})();\n`, map: null };
    },
  };
}
