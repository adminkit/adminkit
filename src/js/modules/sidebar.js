// Usage: https://github.com/Grsmto/simplebar
import { Offcanvas } from "bootstrap";
import SimpleBar from "simplebar";
import { mount } from "./mount";

// From the lg breakpoint the sidebar is part of the layout and the navbar toggle hides and
// shows it. Below it the sidebar is a Bootstrap offcanvas (.offcanvas-lg) that the toggle
// opens as a sheet, which brings the backdrop, focus trap, Escape and scroll lock. The
// handlers listen on document, so they also work for a sidebar or toggle added later.
const sidebarSelector = ".js-sidebar";
const toggleSelector = ".js-sidebar-toggle";

let desktop;
// Read once the stylesheet applies
const isDesktop = () => {
  if (!desktop) {
    const breakpoint = getComputedStyle(
      document.documentElement
    ).getPropertyValue("--bs-breakpoint-lg");
    desktop = matchMedia(`(min-width: ${breakpoint})`);
    // Bootstrap closes the sheet when the window grows past the breakpoint
    desktop.addEventListener("change", updateToggles);
  }
  return desktop.matches;
};

// aria-expanded: the toggle expands and collapses the sidebar it controls; its name says
// what a click does
const updateToggles = () => {
  const sidebar = document.querySelector(sidebarSelector);

  if (!sidebar) {
    return;
  }

  const expanded = isDesktop()
    ? !sidebar.classList.contains("collapsed")
    : sidebar.classList.contains("show");

  for (const toggle of document.querySelectorAll(toggleSelector)) {
    toggle.setAttribute("aria-expanded", String(expanded));
    toggle.setAttribute(
      "aria-label",
      expanded ? "Collapse sidebar" : "Expand sidebar"
    );
  }
};

// Charts resize once the sidebar has moved; without a transition (reduced motion) there is
// no transitionend, so they resize right away
const resizeAfterTransition = (sidebar) => {
  const resize = () => window.dispatchEvent(new Event("resize"));

  if (!parseFloat(getComputedStyle(sidebar).transitionDuration)) {
    resize();
    return;
  }

  const onTransitionEnd = (event) => {
    if (event.target === sidebar) {
      sidebar.removeEventListener("transitionend", onTransitionEnd);
      resize();
    }
  };
  sidebar.addEventListener("transitionend", onTransitionEnd);
};

document.addEventListener("click", (event) => {
  const sidebar = document.querySelector(sidebarSelector);

  if (!sidebar) {
    return;
  }

  if (event.target.closest(toggleSelector)) {
    if (isDesktop()) {
      sidebar.classList.toggle("collapsed");
      updateToggles();
      resizeAfterTransition(sidebar);
    } else {
      Offcanvas.getOrCreateInstance(sidebar).toggle();
    }
  } else if (
    // Following a link closes the sheet
    !isDesktop() &&
    event.target.closest(`${sidebarSelector} a[href]:not([data-bs-toggle])`)
  ) {
    Offcanvas.getInstance(sidebar)?.hide();
  }
});

document.addEventListener("shown.bs.offcanvas", ({ target }) => {
  if (target.matches(sidebarSelector)) {
    updateToggles();
  }
});

// Focus returns to the toggle, as with Bootstrap's data-bs-toggle triggers
document.addEventListener("hidden.bs.offcanvas", ({ target }) => {
  if (target.matches(sidebarSelector)) {
    updateToggles();
    document.querySelector(toggleSelector)?.focus();
  }
});

mount(toggleSelector, updateToggles);

mount(sidebarSelector, (sidebar) => {
  updateToggles();
  return () => Offcanvas.getInstance(sidebar)?.dispose();
});

mount(".js-simplebar", (element) => {
  const simplebar = new SimpleBar(element);
  const recalculate = () => simplebar.recalculate();

  // Recalculate when a sidebar dropdown opens or closes
  element.addEventListener("shown.bs.collapse", recalculate);
  element.addEventListener("hidden.bs.collapse", recalculate);

  return () => simplebar.unMount();
});
