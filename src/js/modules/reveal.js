// Cards fade up as they scroll into view: every top-level .card inside .ak-reveal-cards (the
// layouts put it on <main>, which itself fades in once the page scripts have run) and any
// element with .ak-reveal. Elements that come into view together are staggered through
// --ak-reveal-index, capped at maxStagger steps. The hidden state is CSS under
// html.js-reveal, which js/head.js sets; without JavaScript nothing is hidden. Styles:
// scss/3-components/_reveal.scss.
const selector = ".ak-reveal, .ak-reveal-cards .card:not(.card .card)";
const maxStagger = 8;

const reveal = (elements) => {
  elements.forEach((element, index) => {
    const onTransitionEnd = (event) => {
      if (event.target === element && event.propertyName === "opacity") {
        element.removeEventListener("transitionend", onTransitionEnd);
        element.classList.remove("ak-revealing");
        element.style.removeProperty("--ak-reveal-index");
      }
    };

    element.addEventListener("transitionend", onTransitionEnd);
    element.style.setProperty("--ak-reveal-index", Math.min(index, maxStagger));
    element.classList.add("ak-revealed", "ak-revealing");
  });
};

const observer = new IntersectionObserver((entries) => {
  const visible = entries
    .filter((entry) => entry.isIntersecting)
    .map((entry) => entry.target);

  visible.forEach((element) => observer.unobserve(element));
  reveal(visible);
});

const root = document.documentElement;

// js/head.js shows everything again if this module has not run within a few seconds
root.classList.add("js-reveal-ready");

// Start after the page scripts that build charts and tables on DOMContentLoaded, so their
// layout is in place before the cards become visible
document.addEventListener("DOMContentLoaded", () => {
  if (!root.classList.contains("js-reveal")) {
    return;
  }

  document.querySelectorAll(".ak-reveal-cards").forEach((element) => {
    element.classList.add("ak-revealed");
  });

  document.querySelectorAll(selector).forEach((element) => {
    observer.observe(element);
  });
});
