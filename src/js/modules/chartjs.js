// Usage: https://www.chartjs.org/
// The theme colours this module reads are set by ./theme
import "./theme";
import Chart from "chart.js/auto";
import { color } from "chart.js/helpers";

const setDefaults = (theme) => {
  Chart.defaults.color = theme["gray-600"];
  Chart.defaults.borderColor = color(theme.black).alpha(0.1).rgbString();
};

setDefaults(window.theme);
Chart.defaults.font.family =
  "'Inter', 'Helvetica Neue', 'Helvetica', 'Arial', sans-serif";

// Bars get rounded top corners; lines keep the curve Chart.js 2 drew by default,
// except on radar charts, which it drew straight
Chart.defaults.elements.bar.borderRadius = 10;
Chart.defaults.elements.line.tension = 0.4;
Chart.overrides.radar.elements = { line: { tension: 0 } };

// Charts animate in, except under reduced motion. Colour mode changes update without
// animation (see below).
// Doughnut, pie and polar area charts set their own animation in the dataset defaults.
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const animations = new Map(
  [Chart.defaults, ...Object.values(Chart.defaults.datasets)]
    .filter((scope) => scope.animation !== undefined)
    .map((scope) => [scope, scope.animation])
);
const setAnimation = () => {
  for (const [scope, animation] of animations) {
    scope.animation = reducedMotion.matches ? false : animation;
  }
};

setAnimation();
reducedMotion.addEventListener("change", setAnimation);

const configs = new WeakMap();

// Creates a chart from config(window.theme) and calls config again with the new colours
// when the colour mode changes: adminkit.chartjs("#chart", (theme) => ({ type, data, options }))
const createChart = (element, config) => {
  const canvas =
    typeof element === "string" ? document.querySelector(element) : element;
  const chart = new Chart(canvas, config(window.theme));
  configs.set(chart, config);
  return chart;
};

// Charts created with new Chart() pick up the new default colours only
document.addEventListener("adminkit:themechange", ({ detail: theme }) => {
  setDefaults(theme);

  for (const chart of Object.values(Chart.instances)) {
    const config = configs.get(chart);

    if (config) {
      const { data, options } = config(theme);
      chart.data = data;
      chart.options = options;
    }

    chart.update("none");
  }
});

window.Chart = Chart;
window.adminkit = { ...window.adminkit, chartjs: createChart };
