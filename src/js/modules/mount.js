// The modules set up their markup (icons, the sidebar, SimpleBar, ...) once the page has
// loaded and again whenever such markup is added later, as single-page apps, Turbo and
// Livewire do, so nothing has to be called by hand. One MutationObserver on <body> looks
// at the added elements, and at the removed ones when a setup has something to clean up.
const entries = [];
let started = false;

const matching = (selector, root) => {
  const elements = [...root.querySelectorAll(selector)];
  return root.matches(selector) ? [root, ...elements] : elements;
};

const run = (entry, element) => {
  entry.cleanups.get(element)?.();
  const cleanup = entry.setup(element);
  entry.cleanups.set(element, typeof cleanup === "function" ? cleanup : null);
  entry.cleansUp ||= typeof cleanup === "function";
};

const setUp = (entry, root) => {
  for (const element of matching(entry.selector, root)) {
    if (!entry.cleanups.has(element)) {
      run(entry, element);
    }
  }
};

const tearDown = (entry, root) => {
  for (const element of matching(entry.selector, root)) {
    // A moved element is in the page again by now
    if (!element.isConnected && entry.cleanups.has(element)) {
      entry.cleanups.get(element)?.();
      entry.cleanups.delete(element);
    }
  }
};

const elementNodes = (nodes) =>
  [...nodes].filter((node) => node.nodeType === Node.ELEMENT_NODE);

const observer = new MutationObserver((records) => {
  for (const { type, target, addedNodes, removedNodes } of records) {
    // A changed data-lucide sets the icon up again, which renders the new icon
    if (type === "attributes") {
      for (const entry of entries) {
        if (target.isConnected && target.matches(entry.selector)) {
          run(entry, target);
        }
      }
      continue;
    }

    for (const element of elementNodes(removedNodes)) {
      for (const entry of entries.filter(({ cleansUp }) => cleansUp)) {
        tearDown(entry, element);
      }
    }

    for (const element of elementNodes(addedNodes)) {
      if (element.isConnected) {
        for (const entry of entries) {
          setUp(entry, element);
        }
      }
    }
  }
});

const start = () => {
  started = true;
  for (const entry of entries) {
    setUp(entry, document.body);
  }
  observer.observe(document.body, {
    childList: true,
    subtree: true,
    attributeFilter: ["data-lucide"],
  });
};

/**
 * Calls setup(element) for every element that matches selector, in the page and added later,
 * once per element. When setup returns a function, it is called after the element has left
 * the page.
 */
export const mount = (selector, setup) => {
  const entry = { selector, setup, cleanups: new WeakMap(), cleansUp: false };
  entries.push(entry);

  if (started) {
    setUp(entry, document.body);
  }
};

// js/app.js runs before DOMContentLoaded as a deferred or module script, so it starts then,
// after the page scripts. A framework can also import it once DOMContentLoaded has fired.
const [navigation] = performance.getEntriesByType("navigation");

if (
  navigation?.domContentLoadedEventStart > 0 ||
  document.readyState === "complete"
) {
  start();
} else {
  document.addEventListener("DOMContentLoaded", start);
}
