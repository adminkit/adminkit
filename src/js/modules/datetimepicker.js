import "tempusdominus-bootstrap-4";

$.fn.datetimepicker.Constructor.Default = $.extend(
  {},
  $.fn.datetimepicker.Constructor.Default,
  {
    icons: {
      time: "far fa-clock",
      date: "far fa-calendar",
      up: "fas fa-arrow-up",
      down: "fas fa-arrow-down",
      previous: "fas fa-chevron-left",
      next: "fas fa-chevron-right",
      today: "far fa-calendar-check-o",
      clear: "fas fa-trash",
      close: "fas fa-times"
    }
  }
);
