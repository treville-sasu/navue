importScripts("/precache-manifest.08d40bd49533a1f4e6aaa845237abf54.js", "https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js");

workbox.setConfig({
  debug: true
});

const CACHE_PREFIX = "naVue";

workbox.core.setCacheNameDetails({
  prefix: CACHE_PREFIX
});

self.addEventListener("message", event => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

self.addEventListener("activate", event => {
  self.clients.claim();
});

self.__precacheManifest = [].concat(self.__precacheManifest || []);
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});

workbox.routing.registerRoute(
  ({ request }) => ["font", "styles"].includes(request.destination),
  new workbox.strategies.StaleWhileRevalidate({
    cacheName: `${CACHE_PREFIX}_ui_assets`
  })
);

const CorsProxyPlugin = {
  requestWillFetch: ({ request }) => {
    return new Request(
      "https://cors.treville.workers.dev/" + request.url,
      request
    );
  }
};

const MonthlyExpirationPlugin = new workbox.expiration.Plugin({
  maxEntries: 100,
  maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Days
  purgeOnQuotaError: true
});

workbox.routing.registerRoute(
  ({ url }) => url.origin === "https://aviation.meteo.fr",
  new workbox.strategies.NetworkFirst({
    cacheName: `${CACHE_PREFIX}_aeroweb`,
    networkTimeoutSeconds: 10,
    plugins: [CorsProxyPlugin, MonthlyExpirationPlugin]
  })
);

workbox.routing.registerRoute(
  ({ request }) => request.destination === "image",
  new workbox.strategies.CacheFirst({
    cacheName: `${CACHE_PREFIX}_images`,
    plugins: [
      new workbox.expiration.Plugin({
        maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Days
        purgeOnQuotaError: true
      })
    ]
  })
);

