console.log('sw.js');
importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.2.0/workbox-sw.js');

var cacheVersion = 1;
var cachePrefix = "testingV"+cacheVersion;

if (workbox) {
  console.log(`Yay! Workbox is loaded 🎉`);
  workbox.setConfig({debug: true});
  workbox.routing.registerRoute("/", workbox.strategies.staleWhileRevalidate({ cacheName: cachePrefix+'-cache' }));
  workbox.routing.registerRoute("/?src=pwa", workbox.strategies.staleWhileRevalidate({ cacheName: cachePrefix+'-cache' }));
  workbox.routing.registerRoute(/.*\.json/, workbox.strategies.staleWhileRevalidate({ cacheName: cachePrefix+'-content-cache' }));
  workbox.routing.registerRoute(/.*\.js/, workbox.strategies.staleWhileRevalidate({ cacheName: cachePrefix+'-cache' }));
  workbox.routing.registerRoute(/.*\.css/, workbox.strategies.staleWhileRevalidate({ cacheName: cachePrefix+'-cache' }));
  workbox.routing.registerRoute(/.*\.png/, workbox.strategies.staleWhileRevalidate({ cacheName: cachePrefix+'-cache' }));
}
