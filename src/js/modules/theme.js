// window.theme holds the theme colours for the charts and vector maps, read from the CSS
// custom properties of the current colour mode. It is rebuilt when data-bs-theme changes,
// followed by an adminkit:themechange event on document with the new colours as detail.
const readTheme = () => {
  const style = getComputedStyle(document.documentElement);
  const value = (name) => style.getPropertyValue(`--${name}`).trim();
  const id =
    document.documentElement.getAttribute("data-bs-theme") === "dark"
      ? "dark"
      : "light";

  const theme = {
    id,
    name: id === "dark" ? "Dark" : "Light",
    primary: value("bs-primary"),
    secondary: value("bs-secondary"),
    success: value("bs-success"),
    info: value("bs-info"),
    warning: value("bs-warning"),
    danger: value("bs-danger"),
    // In dark mode white is the surface colour and black the brightest text colour
    white: value("ak-surface-bg"),
    black: value("bs-emphasis-color"),
    "body-bg": value("bs-body-bg"),
    "body-color": value("bs-body-color"),
    "border-color": value("bs-border-color"),
  };

  for (const step of [100, 200, 300, 400, 500, 600, 700, 800, 900]) {
    theme[`gray-${step}`] = value(`bs-gray-${step}`);
  }

  return theme;
};

window.theme = readTheme();

new MutationObserver(() => {
  const theme = readTheme();

  if (theme.id !== window.theme.id) {
    window.theme = theme;
    document.dispatchEvent(
      new CustomEvent("adminkit:themechange", { detail: theme })
    );
  }
}).observe(document.documentElement, {
  attributes: true,
  attributeFilter: ["data-bs-theme"],
});
