// Check that service workers are registered
if ('serviceWorker' in navigator) {
  // Use the window load event to keep the page load performant
  window.addEventListener('load', function(){
    navigator.serviceWorker.register('/sw.js');
  });
}

document.addEventListener('DOMContentLoaded', function(e){ domReady(e); });

var domReady = function(e){
  console.log("domReady", e);
  document.querySelector("input[name=fetchButton]").addEventListener("click", fetchButtonEvent);
}

var fetchButtonEvent = function(e){
  console.log("fetchButtonEvent", e);
  console.log("fetching", e.target.getAttribute("data-uri"));
  fetch(e.target.getAttribute("data-uri"))
  .then(function(response) { return response.json(); })
  .then(function(json) {
    console.log("json loaded")
    console.log(json);
  });
}
