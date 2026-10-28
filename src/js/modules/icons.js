// Lucide icons: https://lucide.dev/icons/
// Only the icons the templates use are bundled. To add one, import it here, add it to
// `icons` and use it as <i data-lucide="icon-name"></i>; `npm run lint` checks the list.
import { mount } from "./mount";
import {
  createElement,
  AppWindow,
  Bell,
  Book,
  Briefcase,
  ChartNoAxesColumn,
  ChartPie,
  Check,
  CircleAlert,
  CircleQuestionMark,
  Coffee,
  CreditCard,
  Eye,
  Heart,
  House,
  LayoutGrid,
  List,
  LogIn,
  LogOut,
  Map,
  MapPin,
  MessageSquare,
  Minus,
  Moon,
  Pen,
  SearchX,
  ServerCrash,
  Settings,
  SlidersVertical,
  Square,
  SquareCheckBig,
  Sun,
  SunMoon,
  Tag,
  TextAlignStart,
  Timer,
  Trash,
  User,
  UserPlus,
  Users,
} from "lucide";

const icons = {
  AppWindow,
  Bell,
  Book,
  Briefcase,
  ChartNoAxesColumn,
  ChartPie,
  Check,
  CircleAlert,
  CircleQuestionMark,
  Coffee,
  CreditCard,
  Eye,
  Heart,
  House,
  LayoutGrid,
  List,
  LogIn,
  LogOut,
  Map,
  MapPin,
  MessageSquare,
  Minus,
  Moon,
  Pen,
  SearchX,
  ServerCrash,
  Settings,
  SlidersVertical,
  Square,
  SquareCheckBig,
  Sun,
  SunMoon,
  Tag,
  TextAlignStart,
  Timer,
  Trash,
  User,
  UserPlus,
  Users,
};

// Each <i data-lucide> gets its icon as a child <svg> with the element's classes and
// attributes, and i[data-lucide] is display: contents (_lucide.scss), so the <svg> takes its
// place in the layout. The <i> stays, so a framework that renders it can update or remove
// it, and changing data-lucide renders the other icon.
const toPascalCase = (name) =>
  name.replace(/(?:^|-)([a-z0-9])/g, (match, character) =>
    character.toUpperCase()
  );

const renderIcon = (
  element,
  { icons = window.lucide.icons, attrs = {} } = {}
) => {
  const name = element.getAttribute("data-lucide");
  const icon = icons[toPascalCase(name)];

  if (!icon) {
    console.warn(
      `Lucide icon "${name}" is not bundled (src/js/modules/icons.js)`
    );
    return;
  }

  // The id stays on the <i> only; the lucide-<name> class names the icon
  const elementAttrs = {};
  for (const attr of element.attributes) {
    if (attr.name !== "id" && attr.name !== "data-lucide") {
      elementAttrs[attr.name] = attr.value;
    }
  }
  const labelled = Object.keys(elementAttrs).some(
    (attr) => attr.startsWith("aria-") || attr === "role" || attr === "title"
  );
  const classes = [
    "lucide",
    `lucide-${name}`,
    ...(elementAttrs.class ?? "").split(" "),
    ...(attrs.class ?? "").split(" "),
  ];

  element.replaceChildren(
    createElement(icon, {
      ...(labelled ? {} : { "aria-hidden": "true" }),
      ...attrs,
      ...elementAttrs,
      class: [...new Set(classes.filter(Boolean))].join(" "),
    })
  );
};

// Icons render by themselves, also when they are added later, so lucide.createIcons() is no
// longer needed. It stays for existing code and renders the same way. On the icons page
// js/icons-all.js adds every other icon, whichever script runs first.
window.lucide = {
  createIcons: ({ icons, attrs, root = document } = {}) => {
    root.querySelectorAll("[data-lucide]:not(svg)").forEach((element) => {
      renderIcon(element, { icons, attrs });
    });
  },
  icons: { ...icons, ...window.lucide?.icons },
};

mount("[data-lucide]:not(svg)", (element) => renderIcon(element));
