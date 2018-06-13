document.addEventListener('DOMContentLoaded', function(e){ domReady(e); });

var domReady = function(e){
  console.log("domReady", e);
  installServiceWorker(e);
  document.querySelector("input[name=fetchButton]").addEventListener("click", fetchButtonEvent, false);
  if('caches' in window) {
    document.querySelector("body").classList.add("caches");
    console.log("caches supported!");
    viewCaches(e);
    setInterval(function(){ viewCaches(); }, 3000);
  }
}

var installServiceWorker = function(e){
  if ('serviceWorker' in navigator) {
    // Use the window load event to keep the page load performant
    navigator.serviceWorker.register('/sw.js', { scope: '/' }).then(function(reg) {
      if(reg.installing) {
        console.log('Service worker installing');
      } else if(reg.waiting) {
        console.log('Service worker installed');
      } else if(reg.active) {
        console.log('Service worker active');
      }
    }).catch(function(error) {
      // registration failed
      console.log('Registration failed with ' + error);
    });
  }

}

var fetchButtonEvent = function(e){
  console.log("fetchButtonEvent");

  console.log("fetching", e.target.getAttribute("data-uri"));
  fetch(e.target.getAttribute("data-uri"))
  .then(function(response) { return response.json(); })
  .then(function(json) {
    console.log("json loaded")
    console.log(json);
  });

}

var viewCaches = function(e){
  console.log("viewCaches");
  let counter = document.querySelector("#cachecount");
  counter.innerHTML = '0'
  var cachedListEl = document.querySelector('#cachedList');
  cachedListEl.innerHTML = ''; // clear it

  if(document.querySelector("body").classList.contains("caches")){
    caches.keys().then(function(cacheKeys) {
      console.log("cacheKeys", cacheKeys);
      cacheKeys.forEach(function(cacheKey, cacheindex){
        caches.open(cacheKey).then(function(cache) {
          // Cache is created / accessible
          console.log("cache", cache);
          cache.keys().then(function(cachedRequests) {
            console.log(cachedRequests); // [Request, Request]
            cachedRequests.forEach(function(cachedReq, cachedReqIndex){
              let newLi = document.createElement("li");
              let newLiVal = document.createTextNode(cachedReq.url);
              newLi.appendChild(newLiVal);
              cachedListEl.appendChild(newLi);
              counter.innerHTML =parseInt(counter.innerHTML)+1;
            });
          });
        });
      });
    });

  }
}
