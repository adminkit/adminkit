// Light, dark or auto (follows the operating system) colour mode. The mode is
// data-bs-theme on <html>; js/head.js sets it from localStorage before the first paint, so
// this module only changes it afterwards, or sets it when the page has no js/head.js.
import { mount } from "./mount";
import appearance from "../../data/appearance.json" with { type: "json" };

const storageKey = "adminkit_config_colorMode";
// src/data/appearance.json lists the modes css/app.css has; scripts/stats.mjs counts them
const colorModes = [...appearance.colorModes, "auto"];
const systemDark = window.matchMedia("(prefers-color-scheme: dark)");

export const getStoredColorMode = () => {
  try {
    const mode = localStorage.getItem(storageKey);
    return colorModes.includes(mode) ? mode : null;
  } catch {
    return null;
  }
};

let colorMode = getStoredColorMode() ?? "auto";

const applyColorMode = () => {
  const theme =
    colorMode === "auto" ? (systemDark.matches ? "dark" : "light") : colorMode;
  document.documentElement.setAttribute("data-bs-theme", theme);
};

export const getColorMode = () => colorMode;

// Dispatches adminkit:colormodechange; window.theme follows through adminkit:themechange
export const setColorMode = (mode, { persist = true } = {}) => {
  if (!colorModes.includes(mode)) {
    return;
  }

  colorMode = mode;

  if (persist) {
    try {
      localStorage.setItem(storageKey, mode);
    } catch {
      // Storage is unavailable (private mode); the mode still applies to this page
    }
  }

  applyColorMode();
  document.dispatchEvent(
    new CustomEvent("adminkit:colormodechange", { detail: { colorMode } })
  );
};

// Controls: any element with data-color-mode-value="light|dark|auto" sets that mode.
// Buttons get .active and aria-pressed, radios get checked. Elements with
// data-color-mode-icon="<mode>" are shown for the current mode only, and the
// data-color-mode-toggle element's aria-label names it.
const controls =
  "[data-color-mode-value], [data-color-mode-icon], [data-color-mode-toggle]";

const syncControl = (element) => {
  const { colorModeValue, colorModeIcon } = element.dataset;

  if (colorModeValue && element instanceof HTMLInputElement) {
    element.checked = colorModeValue === colorMode;
  } else if (colorModeValue) {
    element.classList.toggle("active", colorModeValue === colorMode);
    element.setAttribute("aria-pressed", colorModeValue === colorMode);
  }

  if (colorModeIcon) {
    element.hidden = colorModeIcon !== colorMode;
  }

  if (element.hasAttribute("data-color-mode-toggle")) {
    element.setAttribute("aria-label", `Color mode (${colorMode})`);
  }
};

if (!document.documentElement.hasAttribute("data-bs-theme")) {
  applyColorMode();
}

// Astro's view transitions give <html> the attributes of the new page, which has no
// data-bs-theme: the mode is set again before the page is painted
new MutationObserver(() => {
  if (!document.documentElement.hasAttribute("data-bs-theme")) {
    applyColorMode();
  }
}).observe(document.documentElement, {
  attributes: true,
  attributeFilter: ["data-bs-theme"],
});

systemDark.addEventListener("change", () => {
  if (colorMode === "auto") {
    applyColorMode();
  }
});

document.addEventListener("click", (event) => {
  const control = event.target.closest("[data-color-mode-value]");

  if (control) {
    setColorMode(control.dataset.colorModeValue);
  }
});

document.addEventListener("adminkit:colormodechange", () => {
  document.querySelectorAll(controls).forEach(syncControl);
});

mount(controls, syncControl);
