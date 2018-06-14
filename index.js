document.addEventListener('DOMContentLoaded', function(e){ domReady(e); });

var domReady = function(e){
  console.log("domReady", e);
  installServiceWorker(e);
  document.querySelector("input[name=fetchButton]").addEventListener("click", fetchButtonEvent, false);
  document.querySelector("input[name=fetchButton]").addEventListener("touchend", fetchButtonEvent, false);
  document.querySelector("input[name=cacheButton]").addEventListener("click", cacheButtonEvent, false);
  document.querySelector("input[name=cacheButton]").addEventListener("touchend", cacheButtonEvent, false);
  document.querySelector("input[name=addCachedImageButton]").addEventListener("click", addCachedImageButtonEvent, false);
  document.querySelector("input[name=addCachedImageButton]").addEventListener("touchend", addCachedImageButtonEvent, false);


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
    console.log("fetchButtonEvent() json loaded")
    console.log("fetchButtonEvent() json", json);
  });

}


var cacheButtonEvent = function(e){
  //https://filipbech.github.io/2017/02/service-worker-and-caching-from-other-origins
  console.log("cacheButtonEvent");

  caches.open("testingV1-content-cache").then(function(cache) {
    console.log("cacheButtonEvent() cache", cache);
    //console.log("cacheButtonEvent() cache add", e.target.getAttribute("data-uri"));
    //cache.add(e.target.getAttribute("data-uri"));
    let request = new Request(e.target.getAttribute("data-uri"), { mode: 'no-cors' });
    console.log("cacheButtonEvent() request", request);
    fetch(request).then(function(response){
      cache.put(request, response).then(function(e) {
        console.log("cacheButtonEvent() cache.put()",e);
        // request/response pair has been added to the cache
      });
    });
  });
}

var addCachedImageButtonEvent = function(e){
  //https://filipbech.github.io/2017/02/service-worker-and-caching-from-other-origins
  console.log("cacheButtonEvent");
  let newImg = document.createElement("img");
  newImg.src = e.target.getAttribute("data-uri");
  document.querySelector("body").appendChild(newImg);
}

var viewCaches = function(e){
  console.log("viewCaches");
  let counter = document.querySelector("#cachecount");
  counter.innerHTML = '0'
  var cachedListEl = document.querySelector('#cachedList');
  cachedListEl.innerHTML = ''; // clear it

  if(document.querySelector("body").classList.contains("caches")){
    caches.keys().then(function(cacheKeys) {
      console.log("viewCaches() cacheKeys", cacheKeys);
      cacheKeys.forEach(function(cacheKey, cacheindex){
        caches.open(cacheKey).then(function(cache) {
          // Cache is created / accessible
          //console.log("viewCaches() cache", cache);
          cache.keys().then(function(cachedRequests) {
            //console.log(cachedRequests); // [Request, Request]
            cachedRequests.forEach(function(cachedReq, cachedReqIndex){
              let newLi = document.createElement("li");
              let newLiVal = document.createTextNode(cacheKey+" - "+cachedReq.url);
              newLi.appendChild(newLiVal);
              cachedListEl.appendChild(newLi);
              counter.innerHTML = parseInt(document.querySelectorAll("#cachedList li").length);
            });
          });
        });
      });
    });

  }
}
