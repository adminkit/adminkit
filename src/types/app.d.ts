// Types for js/app.js (`import "@adminkit/core"`). The import has no exports: it sets up
// the page and adds the globals below. Copied to dist/js/app.d.ts by the build.
import type { Chart, ChartConfiguration } from "chart.js";
import type { IconNode } from "lucide";
import type { Calendar } from "vanilla-calendar-pro";

/** The colors of the current color mode (window.theme), read from the CSS custom properties. */
export interface AdminKitTheme {
  id: "light" | "dark";
  name: "Light" | "Dark";
  primary: string;
  secondary: string;
  success: string;
  info: string;
  warning: string;
  danger: string;
  /** The surface color: white in light mode */
  white: string;
  /** The strongest text color: black in light mode */
  black: string;
  "body-bg": string;
  "body-color": string;
  "border-color": string;
  "gray-100": string;
  "gray-200": string;
  "gray-300": string;
  "gray-400": string;
  "gray-500": string;
  "gray-600": string;
  "gray-700": string;
  "gray-800": string;
  "gray-900": string;
}

export interface AdminKit {
  /** Creates a Chart.js chart and calls config again with the new colors when the color mode changes. */
  chartjs(
    element: string | HTMLCanvasElement,
    config: (theme: AdminKitTheme) => ChartConfiguration
  ): Chart;
  /** Creates a jsVectorMap map (options.selector names the element) that recolors with the color mode. */
  vectorMap(
    config: (theme: AdminKitTheme) => {
      selector: string | HTMLElement;
      [option: string]: unknown;
    }
  ): unknown;
  /** Removes the loading placeholders around element and fires adminkit:ready on it. */
  ready(element: Element): void;
}

declare global {
  interface Window {
    adminkit: AdminKit;
    theme: AdminKitTheme;
    lucide: {
      /** Renders the icons in root; icons added to the page later render by themselves. */
      createIcons(options?: {
        icons?: Record<string, IconNode>;
        attrs?: Record<string, string>;
        root?: ParentNode;
      }): void;
      icons: Record<string, IconNode>;
    };
    /** The bootstrap module (Bootstrap 5.3), which ships no types of its own. */
    bootstrap: any;
    Chart: typeof Chart;
    VanillaCalendar: { Calendar: typeof Calendar };
  }

  interface DocumentEventMap {
    "adminkit:themechange": CustomEvent<AdminKitTheme>;
    "adminkit:colormodechange": CustomEvent<{
      colorMode: "light" | "dark" | "auto";
    }>;
    "adminkit:ready": CustomEvent<null>;
  }
}
