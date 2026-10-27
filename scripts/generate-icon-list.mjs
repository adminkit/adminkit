// Writes src/data/icons-lucide.json (name and search tags of every Lucide icon) from
// lucide-static, for the icons page. Run `npm run icons:list` after upgrading lucide.
import { readFile, writeFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import prettier from "prettier";

const require = createRequire(import.meta.url);
const tags = JSON.parse(
  await readFile(require.resolve("lucide-static/tags.json"), "utf8")
);
const output = fileURLToPath(
  new URL("../src/data/icons-lucide.json", import.meta.url)
);

const icons = Object.keys(tags)
  .sort()
  .map((name) => ({ name, tags: tags[name] }));

const json = await prettier.format(JSON.stringify(icons), {
  ...(await prettier.resolveConfig(output)),
  filepath: output,
});
await writeFile(output, json);
console.log(`Wrote ${icons.length} icons to src/data/icons-lucide.json`);
