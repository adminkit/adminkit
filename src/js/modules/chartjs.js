// Usage: https://www.chartjs.org/
// import { Chart } from "chart.js";
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);
Chart.defaults.defaultFontFamily = "'Inter', 'Helvetica Neue', 'Helvetica', 'Arial', sans-serif";

window.Chart = Chart;
