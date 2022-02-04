// Usage: https://www.chartjs.org/
import Chart from "chart.js";

Chart.defaults.global.defaultFontColor = window.theme["gray-600"];
Chart.defaults.global.defaultFontFamily = "'Inter', 'Helvetica Neue', 'Helvetica', 'Arial', sans-serif";
window.Chart = Chart;