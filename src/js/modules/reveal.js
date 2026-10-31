// Cards fade up as they scroll into view: every top-level .card inside .reveal-cards (the
// layouts put it on <main>, which itself fades in once the page scripts have run) and any
// element with .reveal. Elements that come into view together are staggered through
// --ak-reveal-index, capped at maxStagger steps. The hidden state is CSS under
// html.js-reveal, which js/head.js sets; without JavaScript nothing is hidden. Styles:
// scss/3-components/_reveal.scss. .ak-reveal and .ak-reveal-cards are v4 aliases, remove
// them in v5.
import { mount } from "./mount";

const cards = ".reveal-cards, .ak-reveal-cards";
const selector = `.reveal, .ak-reveal, :is(${cards}) .card:not(.card .card)`;
const maxStagger = 8;

const reveal = (elements) => {
  elements.forEach((element, index) => {
    const onTransitionEnd = (event) => {
      if (event.target === element && event.propertyName === "opacity") {
        element.removeEventListener("transitionend", onTransitionEnd);
        element.classList.remove("revealing");
        element.style.removeProperty("--ak-reveal-index");
      }
    };

    element.addEventListener("transitionend", onTransitionEnd);
    element.style.setProperty("--ak-reveal-index", Math.min(index, maxStagger));
    element.classList.add("revealed", "revealing");
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

// mount() starts after the page scripts that build charts and tables on DOMContentLoaded, so
// their layout is in place before the cards become visible
if (root.classList.contains("js-reveal")) {
  mount(cards, (element) => element.classList.add("revealed"));
  mount(selector, (element) => observer.observe(element));
}
