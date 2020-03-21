import "bootstrap";

setTimeout(() => {
  // Popovers
  // Note: Disable this if you're not using Bootstrap's Popovers
  $('[data-toggle="popover"]').popover();

  // Tooltips
  // Note: Disable this if you're not using Bootstrap's Tooltips
  $('[data-toggle="tooltip"]').tooltip();
}, 500);
