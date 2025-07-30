const CACHE_NAME = "packsaz-cache-v1";
const urlsToCache = [
  "/",
  "/index.html",
  "/main.html",
  "/main.css",
  "/main.js",
  "/manifest.json",
  "/fonts/Vazirmatn-Black.woff2",
  "/fonts/Vazirmatn-Regular.woff2",
  "/splash-image.png",
  "/icons/icon-192.png",
  "/icons/icon-512.png"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(cacheNames =>
      Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      )
    )
  );
});
