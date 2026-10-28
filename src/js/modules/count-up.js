// Numbers marked with data-count-up count up from zero the first time they scroll into
// view. The element's text is the final value and sets the format: anything around the
// number stays ("$", "%", "+", "-") and the number keeps its "," thousands separators and
// its decimals ("$21,300", "+2.65%", "1,024.50"). The text ends on the original string,
// and with reduced motion it never changes. Put it on an element that holds only the
// number and sits on a line of its own, such as the stat cards' .h1, so its changing width
// does not move anything else.
import { mount } from "./mount";

const duration = 1000;
const number = /(\d{1,3}(?:,\d{3})+|\d+)(\.\d+)?/;
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

const parse = (text) => {
  const match = text.match(number);

  if (!match) {
    return null;
  }

  const [digits, integer, fraction = ""] = match;
  const decimals = Math.max(fraction.length - 1, 0);

  return {
    before: text.slice(0, match.index),
    after: text.slice(match.index + digits.length),
    value: Number(integer.replaceAll(",", "") + fraction),
    format: new Intl.NumberFormat("en-US", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
      useGrouping: integer.includes(","),
    }),
  };
};

const countUp = (element) => {
  const text = element.textContent;
  const parsed = parse(text);

  if (!parsed) {
    return;
  }

  const { before, after, value, format } = parsed;
  const start = performance.now();

  const step = (now) => {
    const progress = Math.min((now - start) / duration, 1);

    if (progress < 1) {
      const eased = 1 - (1 - progress) ** 3;
      element.textContent = before + format.format(value * eased) + after;
      requestAnimationFrame(step);
    } else {
      element.textContent = text;
    }
  };

  requestAnimationFrame(step);
};

const observer = new IntersectionObserver((entries) => {
  for (const entry of entries) {
    if (entry.isIntersecting) {
      observer.unobserve(entry.target);
      countUp(entry.target);
    }
  }
});

if (!reducedMotion.matches) {
  mount("[data-count-up]", (element) => observer.observe(element));
}
