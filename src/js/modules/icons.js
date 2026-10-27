// Lucide icons: https://lucide.dev/icons/
// Only the icons the templates use are bundled. To add one, import it here, add it to
// `icons` and use it as <i data-lucide="icon-name"></i>; `npm run lint` checks the list.
import {
  createIcons,
  Bell,
  Book,
  Briefcase,
  ChartNoAxesColumn,
  ChartPie,
  CircleAlert,
  CircleQuestionMark,
  Coffee,
  DollarSign,
  Heart,
  House,
  LayoutGrid,
  LogIn,
  Map,
  MapPin,
  MessageSquare,
  Settings,
  ShoppingCart,
  SlidersVertical,
  Square,
  SquareCheckBig,
  TextAlignStart,
  Truck,
  User,
  UserPlus,
  Users,
} from "lucide";

const icons = {
  Bell,
  Book,
  Briefcase,
  ChartNoAxesColumn,
  ChartPie,
  CircleAlert,
  CircleQuestionMark,
  Coffee,
  DollarSign,
  Heart,
  House,
  LayoutGrid,
  LogIn,
  Map,
  MapPin,
  MessageSquare,
  Settings,
  ShoppingCart,
  SlidersVertical,
  Square,
  SquareCheckBig,
  TextAlignStart,
  Truck,
  User,
  UserPlus,
  Users,
};

// On the icons page js/icons-all.js adds every other icon, whichever script runs first.
// Call lucide.createIcons({ icons: lucide.icons }) again after adding icon markup.
window.lucide = { createIcons, icons: { ...icons, ...window.lucide?.icons } };

document.addEventListener("DOMContentLoaded", () => {
  window.lucide.createIcons({ icons: window.lucide.icons });
});
