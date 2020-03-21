// Usage: https://github.com/Grsmto/simplebar
import SimpleBar from "simplebar";

$(function() {
  /* Initialize simplebar */
  new SimpleBar(document.getElementsByClassName("js-simplebar")[0])

  /* Sidebar toggle behaviour */
  $(".sidebar-toggle").on("click", function() {
    $(".sidebar")
      .toggleClass("collapsed")
      // Triger resize after animation
      .one("transitionend", function() {
        setTimeout(function() {
          window.dispatchEvent(new Event("resize"));
        }, 100);
      });
  });
});
