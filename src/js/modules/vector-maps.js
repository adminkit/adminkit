// Usage: https://github.com/themustafaomar/jsvectormap
// The theme colours this module reads are set by ./theme
import "./theme";
import "jsvectormap";
import "./vector-maps/world.js";

const maps = new Set();

// Creates a map from config(window.theme) and restyles its regions and markers with
// config(newTheme) when the colour mode changes:
// adminkit.vectorMap((theme) => ({ selector: "#map", map: "world", regionStyle, markerStyle }))
const createMap = (config) => {
  const map = new window.jsVectorMap(config(window.theme));
  maps.add({ map, config });
  return map;
};

document.addEventListener("adminkit:themechange", ({ detail: theme }) => {
  for (const { map, config } of maps) {
    const { regionStyle, markerStyle } = config(theme);

    if (regionStyle?.initial) {
      for (const { element } of Object.values(map.regions)) {
        element.setStyle(regionStyle.initial);
      }
    }

    if (markerStyle?.initial) {
      for (const { element } of Object.values(map._markers)) {
        element.setStyle(markerStyle.initial);
      }
    }
  }
});

window.adminkit = { ...window.adminkit, vectorMap: createMap };
