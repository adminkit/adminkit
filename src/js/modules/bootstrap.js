import { Tooltip, Popover } from "bootstrap";

// Popovers
// Note: Disable this if you're not using Bootstrap's Popovers
const popoverTriggerList = [].slice.call(document.querySelectorAll("[data-toggle=\"popover\"]"))
popoverTriggerList.map((popoverTriggerEl) => {
  return new Popover(popoverTriggerEl)
})

// Tooltips
// Note: Disable this if you're not using Bootstrap's Tooltips
const tooltipTriggerList = [].slice.call(document.querySelectorAll("[data-toggle=\"tooltip\"]"))
tooltipTriggerList.map((tooltipTriggerEl) => {
  return new Tooltip(tooltipTriggerEl)
})