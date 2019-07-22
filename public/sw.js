const self = this;
const cacheVersion = "0.0.1";
const curCacheName = `sa-cache${cacheVersion}`;

self.addEventListener("install", () => {
  console.log("installing service worker");
});

const deleteOutdatedCache = curCacheName => {
  const cacheWhitelist = [curCacheName];

  return caches.keys().then(cacheNames => {
    return Promise.all(
      cacheNames.map(cacheName => {
        if (cacheWhitelist.indexOf(cacheName) === -1) {
          return caches.delete(cacheName);
        }
        return Promise.resolve();
      })
    );
  });
};

self.addEventListener("activate", event => {
  console.log("activating service worker");
  event.waitUntil(deleteOutdatedCache(curCacheName));
});

const isImageToCache = url => {
  const imageTypeToCache = [".tif", ".jpg", ".gif", ".png", ".webp"];
  for (let i = 0; i < imageTypeToCache.length; i++) {
    if (url.endsWith(imageTypeToCache[i])) {
      return true;
    }
  }
  return false;
};

const cacheFirstStrategy = request => {
  return caches.match(request).then(cacheResponse => {
    if (cacheResponse) {
      return cacheResponse;
    }

    return fetch(request).then(networkResponse => {
      if (!networkResponse.ok) {
        return networkResponse;
      }

      return caches.open(curCacheName).then(cache => {
        cache.put(request.url, networkResponse.clone());
        return networkResponse;
      });
    });
  });
};

self.addEventListener("fetch", event => {
  if (isImageToCache(event.request.url)) {
    event.respondWith(cacheFirstStrategy(event.request));
  }
});
