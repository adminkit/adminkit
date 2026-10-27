// Usage: https://github.com/Grsmto/simplebar
import { Offcanvas } from "bootstrap";
import SimpleBar from "simplebar";

// From the lg breakpoint the sidebar is part of the layout and the navbar toggle hides and
// shows it. Below it the sidebar is a Bootstrap offcanvas (.offcanvas-lg) that the toggle
// opens as a sheet, which brings the backdrop, focus trap, Escape and scroll lock.

const initializeSimplebar = (sidebar) => {
  const content = sidebar.querySelector(".js-simplebar");

  if (content) {
    const simplebar = new SimpleBar(content);

    // Recalculate on sidebar dropdown toggle
    sidebar.querySelectorAll("[data-bs-parent]").forEach((dropdown) => {
      dropdown.addEventListener("shown.bs.collapse", () =>
        simplebar.recalculate()
      );
      dropdown.addEventListener("hidden.bs.collapse", () =>
        simplebar.recalculate()
      );
    });
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

const initializeSidebarToggle = (sidebar, toggle) => {
  const breakpoint = getComputedStyle(
    document.documentElement
  ).getPropertyValue("--bs-breakpoint-lg");
  const desktop = matchMedia(`(min-width: ${breakpoint})`);
  const sheet = Offcanvas.getOrCreateInstance(sidebar);

  // aria-expanded: the toggle expands and collapses the sidebar it controls; its name says
  // what a click does
  const updateToggle = () => {
    const expanded = desktop.matches
      ? !sidebar.classList.contains("collapsed")
      : sidebar.classList.contains("show");
    toggle.setAttribute("aria-expanded", String(expanded));
    toggle.setAttribute(
      "aria-label",
      expanded ? "Collapse sidebar" : "Expand sidebar"
    );
  };

  updateToggle();

  toggle.addEventListener("click", () => {
    if (desktop.matches) {
      sidebar.classList.toggle("collapsed");
      updateToggle();
      resizeAfterTransition(sidebar);
    } else {
      sheet.toggle();
    }
  });

  // Following a link closes the sheet
  sidebar.addEventListener("click", (event) => {
    if (
      !desktop.matches &&
      event.target.closest("a[href]:not([data-bs-toggle])")
    ) {
      sheet.hide();
    }
  });

  sidebar.addEventListener("shown.bs.offcanvas", updateToggle);
  // Focus returns to the toggle, as with Bootstrap's data-bs-toggle triggers
  sidebar.addEventListener("hidden.bs.offcanvas", () => {
    updateToggle();
    toggle.focus();
  });
  // Bootstrap closes the sheet when the window grows past the breakpoint
  desktop.addEventListener("change", updateToggle);
};

document.addEventListener("DOMContentLoaded", () => {
  const sidebar = document.querySelector(".js-sidebar");
  const toggle = document.querySelector(".js-sidebar-toggle");

  if (sidebar) {
    initializeSimplebar(sidebar);

    if (toggle) {
      initializeSidebarToggle(sidebar, toggle);
    }
  }
});
