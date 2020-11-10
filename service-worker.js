importScripts("/precache-manifest.2f0c35b59008eeecb627392d543e2608.js", "https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js");

/* eslint-disable no-undef */
workbox.setConfig({
  debug: false
});

const CACHE_PREFIX = "naVue";

workbox.core.setCacheNameDetails({
  prefix: CACHE_PREFIX
});

self.addEventListener("activate", () => {
  self.clients.claim();
});

self.addEventListener("message", event => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
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
      //FIXME: use MonthlyExpirationPlugin ?
      new workbox.expiration.Plugin({
        maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Days
        purgeOnQuotaError: true
      })
    ]
  })
);

