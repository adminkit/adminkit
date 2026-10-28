import { readFileSync } from "node:fs";

// Ships hand-written TypeScript declarations next to the bundles they describe:
// declarations({ "js/app.d.ts": "src/js/app.d.ts" })
export default function declarations(files) {
  return {
    name: "declarations",
    apply: "build",
    generateBundle() {
      for (const [fileName, path] of Object.entries(files)) {
        this.emitFile({
          type: "asset",
          fileName,
          source: readFileSync(path, "utf8"),
        });
      }
    },
  };
}
