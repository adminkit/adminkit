// Runs in <head> before the stylesheet, so the first paint already has the right color mode
// and hides the cards that fade in. Load it as a plain, blocking script:
// <script src="js/head.js"></script>
const root = document.documentElement;

// Color mode: the one stored by js/modules/color-mode.js, or the operating system's for auto
let colorMode;
try {
  colorMode = localStorage.getItem("adminkit_config_colorMode");
} catch {
  // Storage is unavailable (private mode)
}
if (colorMode !== "light" && colorMode !== "dark") {
  colorMode = matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}
root.setAttribute("data-bs-theme", colorMode);

// Cards fade in as they scroll into view (js/modules/reveal.js). They stay visible without
// JavaScript, and when js/app.js has not started within 3 seconds.
root.classList.add("js-reveal");
setTimeout(() => {
  if (!root.classList.contains("js-reveal-ready")) {
    root.classList.remove("js-reveal");
  }
}, 3000);
