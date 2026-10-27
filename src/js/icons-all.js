// Every Lucide icon, for the icons page. js/app.js only bundles the icons the templates use.
// The icons come from lucide-static's icon nodes rather than the lucide package, so this
// bundle shares no modules with js/app.js and app.js stays a single self-contained file.
import iconNodes from "lucide-static/icon-nodes.json";

const toPascalCase = (name) =>
  name.replace(/(?:^|-)([a-z0-9])/g, (match, character) =>
    character.toUpperCase()
  );

const icons = Object.fromEntries(
  Object.entries(iconNodes).map(([name, node]) => [toPascalCase(name), node])
);

window.lucide = {
  ...window.lucide,
  icons: { ...window.lucide?.icons, ...icons },
};
