const self = this;
const cacheVersion = "0.0.2";
const appShellCacheName = `sa-origin-cache${cacheVersion}`;

self.addEventListener("install", () => {
  console.log("installing service worker");
});

const deleteCacheOtherThan = curCacheName => () => {
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

const deleteOutdatedCache = deleteCacheOtherThan(appShellCacheName);

self.addEventListener("activate", event => {
  console.log("activating service worker");
  event.waitUntil(deleteOutdatedCache());
});

self.addEventListener("message", event => {
  switch (event.data) {
    case "logout":
      deleteOutdatedCache();
      break;
    default:
  }
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

      return caches.open(appShellCacheName).then(cache => {
        cache.put(request.url, networkResponse.clone());
        return networkResponse;
      });
    });
  });
};

const networkFirstStrategyFactory = cacheName => request => {
  return fetch(request)
    .then(networkResponse => {
      if (!networkResponse.ok) {
        throw new Error();
      }
      return networkResponse;
    })
    .then(networkResponse => {
      return caches.open(cacheName).then(cache => {
        cache.put(request.url, networkResponse.clone());
        return networkResponse;
      });
    })
    .catch(() => {
      return caches.match(request);
    });
};

const shellStrategy = networkFirstStrategyFactory(appShellCacheName);

const isShellInfo = urlToFetch => {
  return (
    urlToFetch.startsWith(self.origin) || urlToFetch.endsWith("/upcomingevents")
  );
};

self.addEventListener("fetch", event => {
  const request = event.request;
  const urlToFetch = event.request.url;

  let strategy;
  if (isImageToCache(urlToFetch)) {
    strategy = cacheFirstStrategy(request);
  } else if (isShellInfo(urlToFetch)) {
    strategy = shellStrategy(request);
  }

  strategy && event.respondWith(strategy);
});
