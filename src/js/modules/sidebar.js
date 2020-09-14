// Usage: https://github.com/Grsmto/simplebar
import SimpleBar from "simplebar";

document.addEventListener("DOMContentLoaded", () => {
  const simpleBarElement = document.getElementsByClassName("js-simplebar")[0];
  
  if(simpleBarElement){
    /* Initialize simplebar */
    new SimpleBar(document.getElementsByClassName("js-simplebar")[0])
  
    const sidebarElement = document.getElementsByClassName("sidebar")[0];
    const sidebarToggleElement = document.getElementsByClassName("sidebar-toggle")[0];
  
    sidebarToggleElement.addEventListener("click", () => {
      sidebarElement.classList.toggle("collapsed");
  
      sidebarElement.addEventListener("transitionend", () => {
        window.dispatchEvent(new Event("resize"));
      });
    });
  }

});