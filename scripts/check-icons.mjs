// Checks that src/js/modules/icons.js bundles exactly the Lucide icons the templates use:
// every data-lucide="name" in src/**/*.{html,hbs,js} (and every value passed to a partial
// that renders data-lucide="{{ param }}") must be imported, and every import must be used.
// The icons page loads js/icons-all.js with the full set, so it is skipped.
import { readFile, readdir } from "node:fs/promises";
import { createRequire } from "node:module";
import { extname, join, relative, sep } from "node:path";

const root = join(import.meta.dirname, "..");
const src = join(root, "src");
const iconsModule = join(src, "js/modules/icons.js");
const skipped = [iconsModule, join(src, "pages/icons-lucide.html")];

const require = createRequire(import.meta.url);
const canonical = new Set(Object.keys(require("lucide-static/tags.json")));

const display = (file) => relative(root, file).split(sep).join("/");

// Same conversion as lucide's createIcons: "circle-alert" -> "CircleAlert"
const toPascalCase = (name) =>
  name
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("");

const files = (await readdir(src, { recursive: true }))
  .map((file) => join(src, file))
  .filter((file) => [".html", ".hbs", ".js"].includes(extname(file)))
  .filter((file) => !file.includes(join("js", "modules", "vector-maps")))
  .filter((file) => !skipped.includes(file));
const sources = new Map(
  await Promise.all(
    files.map(async (file) => [file, await readFile(file, "utf8")])
  )
);

const errors = [];
const used = new Map();
const use = (name, file) => {
  if (!used.has(name)) used.set(name, new Set());
  used.get(name).add(display(file));
};

for (const [file, source] of sources) {
  for (const [, value] of source.matchAll(/data-lucide="([^"]*)"/g)) {
    const param = value.match(/^\{\{\s*([\w-]+)\s*\}\}$/)?.[1];
    if (!value.includes("{{")) {
      use(value, file);
    } else if (param && file.startsWith(join(src, "partials"))) {
      // Partials are named by their path in src/partials: dashboard/stats
      const partial = relative(join(src, "partials"), file)
        .split(sep)
        .join("/")
        .replace(/\.hbs$/, "");
      const call = new RegExp(
        String.raw`\{\{>\s*${partial}\s[^}]*\b${param}="([^"]+)"`,
        "g"
      );
      for (const [caller, callerSource] of sources) {
        for (const [, name] of callerSource.matchAll(call)) use(name, caller);
      }
    } else {
      errors.push(`${display(file)}: cannot resolve data-lucide="${value}"`);
    }
  }
}

const iconsSource = await readFile(iconsModule, "utf8");
const imports = new Set(
  iconsSource
    .match(/import\s*\{([^}]*)\}\s*from\s*"lucide"/)[1]
    .split(",")
    .map((name) => name.trim())
    .filter((name) => name && name !== "createIcons")
);
const registered = new Set(
  iconsSource
    .match(/const icons = \{([^}]*)\}/)[1]
    .split(",")
    .map((name) => name.trim())
    .filter(Boolean)
);

for (const [name, where] of used) {
  const component = toPascalCase(name);
  const files = [...where].join(", ");
  if (!canonical.has(name)) {
    errors.push(
      `"${name}" is not a Lucide icon name (or is a deprecated alias), used in ${files}`
    );
  } else if (!imports.has(component) || !registered.has(component)) {
    errors.push(
      `"${name}" is used in ${files} but ${component} is not imported and added to icons in src/js/modules/icons.js`
    );
  }
}

const usedComponents = new Set([...used.keys()].map(toPascalCase));
for (const component of new Set([...imports, ...registered])) {
  if (!usedComponents.has(component)) {
    errors.push(
      `${component} is bundled in src/js/modules/icons.js but no template uses it`
    );
  } else if (!imports.has(component) || !registered.has(component)) {
    errors.push(
      `${component} must be both imported and added to icons in src/js/modules/icons.js`
    );
  }
}

if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}
console.log(`check-icons: ${used.size} Lucide icons used, all bundled`);
