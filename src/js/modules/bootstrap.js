import * as bootstrap from "bootstrap";

// Popovers
// Note: Disable this if you're not using Bootstrap's Popovers
const popoverTriggerList = [].slice.call(document.querySelectorAll("[data-bs-toggle=\"popover\"]"))
popoverTriggerList.map((popoverTriggerEl) => {
  return new bootstrap.Popover(popoverTriggerEl)
})

// Tooltips
// Note: Disable this if you're not using Bootstrap's Tooltips
const tooltipTriggerList = [].slice.call(document.querySelectorAll("[data-bs-toggle=\"tooltip\"]"))
tooltipTriggerList.map((tooltipTriggerEl) => {
  return new bootstrap.Tooltip(tooltipTriggerEl)
})

// Bootstrap
// Note: If you want to make bootstrap globally available, e.g. for using `bootstrap.modal`
window.bootstrap = bootstrap;