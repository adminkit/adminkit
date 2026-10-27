// Light, dark or auto (follows the operating system) colour mode. The mode is
// data-bs-theme on <html>; the inline script in the page <head> sets it from localStorage
// before the first paint, so this module only changes it afterwards.

const storageKey = "adminkit_config_colorMode";
const colorModes = ["light", "dark", "auto"];
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
const syncControls = () => {
  for (const control of document.querySelectorAll("[data-color-mode-value]")) {
    const active = control.dataset.colorModeValue === colorMode;

    if (control instanceof HTMLInputElement) {
      control.checked = active;
    } else {
      control.classList.toggle("active", active);
      control.setAttribute("aria-pressed", active);
    }
  }

  for (const icon of document.querySelectorAll("[data-color-mode-icon]")) {
    icon.hidden = icon.dataset.colorModeIcon !== colorMode;
  }

  for (const toggle of document.querySelectorAll("[data-color-mode-toggle]")) {
    toggle.setAttribute("aria-label", `Color mode (${colorMode})`);
  }
};

if (!document.documentElement.hasAttribute("data-bs-theme")) {
  applyColorMode();
}

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

document.addEventListener("adminkit:colormodechange", syncControls);
document.addEventListener("DOMContentLoaded", syncControls);
