// Usage: https://feathericons.com/
import feather from "feather-icons";

document.addEventListener("DOMContentLoaded", () => {
  try {
    feather.replace();
  }
  catch(e) {
    console.log('You might have made a typo with one of the feather icons');
    console.log(e);
  }
});

window.feather = feather;