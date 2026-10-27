// Usage: https://www.chartjs.org/
// The theme colours this module reads are set by ./theme
import "./theme";
import Chart from "chart.js/auto";

Chart.defaults.color = window.theme["gray-600"];
Chart.defaults.font.family =
  "'Inter', 'Helvetica Neue', 'Helvetica', 'Arial', sans-serif";

// Bars get rounded top corners; lines keep the curve Chart.js 2 drew by default,
// except on radar charts, which it drew straight
Chart.defaults.elements.bar.borderRadius = 10;
Chart.defaults.elements.line.tension = 0.4;
Chart.overrides.radar.elements = { line: { tension: 0 } };

window.Chart = Chart;
