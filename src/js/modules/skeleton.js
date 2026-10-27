// Loading placeholders for content that JavaScript draws (charts, maps, tables). The markup
// shows an .ak-skeleton inside an element marked aria-busy="true"; markReady(element)
// removes the placeholders around element, sets aria-busy="false" and fires
// adminkit:ready on element. The chart, map and table helpers call it when they have
// drawn; call adminkit.ready(element) for your own content. Styles:
// scss/3-components/_skeleton.scss.
export const markReady = (element) => {
  const busy = element.closest('[aria-busy="true"]');

  if (busy) {
    busy.querySelectorAll(".ak-skeleton").forEach((skeleton) => {
      skeleton.remove();
    });
    busy.setAttribute("aria-busy", "false");
  }

  element.dispatchEvent(new CustomEvent("adminkit:ready", { bubbles: true }));
};

window.adminkit = { ...window.adminkit, ready: markReady };
