const CACHE_PREFIX = "naVue";

/* eslint-disable no-undef */
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

async function RouteRequest(url, init) {
  const body = init.headers.get("Content-Type") ? await init.blob() : undefined;
  return new Request(url, {
    method: init.method,
    headers: init.headers,
    body,
    mode: init.mode,
    credentials: init.credentials,
    cache: init.cache,
    redirect: init.redirect,
    referrer: init.referrer,
    integrity: init.integrity
  });
}

const MixedContentPlugin = {
  requestWillFetch: async ({ request }) => {
    const url = new URL(request.url);
    url.protocol = "http:";

    return await RouteRequest(url.toString(), request);
  }
};

const CorsProxyPlugin = {
  requestWillFetch: async ({ request }) => {
    const proxiedUrl = new URL(process.env.VUE_APP_PROXY);
    proxiedUrl.search = new URLSearchParams({ cors: request.url });

    return await RouteRequest(proxiedUrl.toString(), request);
  }
};

const MonthlyExpirationPlugin = new workbox.expiration.Plugin({
  maxEntries: 100,
  maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Days
  purgeOnQuotaError: true
});

const DailyExpirationPlugin = new workbox.expiration.Plugin({
  maxEntries: 100,
  maxAgeSeconds: 24 * 60 * 60, // 1 Day
  purgeOnQuotaError: true
});

// Migration to Workbox v5
// const handler = workbox.precaching.createHandlerBoundToURL("/index.html");
// const navigationRoute = new workbox.routing.NavigationRoute(handler);
// workbox.routing.registerRoute(navigationRoute);
workbox.routing.registerNavigationRoute(
  workbox.precaching.getCacheKeyForURL("/index.html")
);

//FIXME some style is not cached, route did not match for https://fonts.googleapis.com/css?family=Lato:400,700,400italic&display=swap
workbox.routing.registerRoute(
  ({ request }) => ["font", "styles"].includes(request.destination),
  new workbox.strategies.StaleWhileRevalidate({
    cacheName: `${CACHE_PREFIX}_ui_assets`
  })
);

//////////////////////// Meteo France ///////////////////////////////////
// TODO: should not cache VALIDATION request
workbox.routing.registerRoute(
  new RegExp("^.*aviation.meteo.fr"),
  new workbox.strategies.NetworkFirst({
    cacheName: `${CACHE_PREFIX}_aeroweb`,
    networkTimeoutSeconds: 10,
    plugins: [CorsProxyPlugin, DailyExpirationPlugin]
  })
);

//////////////////////// SIA ///////////////////////////////////

workbox.routing.registerRoute(
  new RegExp("^.*www.sia.aviation-civile.gouv.fr/pub"),
  new workbox.strategies.NetworkFirst({
    cacheName: `${CACHE_PREFIX}_SIA_AZBA`,
    networkTimeoutSeconds: 10,
    plugins: [CorsProxyPlugin, DailyExpirationPlugin]
  })
);

workbox.routing.registerRoute(
  new RegExp("^.*www.sia.aviation-civile.gouv.fr/dvd"),
  new workbox.strategies.NetworkFirst({
    cacheName: `${CACHE_PREFIX}_SIA_VAC`,
    networkTimeoutSeconds: 10,
    plugins: [CorsProxyPlugin, MonthlyExpirationPlugin]
  })
);

// for / AND /schedule
workbox.routing.registerRoute(
  new RegExp("^.*www.sia.aviation-civile.gouv.fr"),
  new workbox.strategies.NetworkOnly({
    plugins: [CorsProxyPlugin]
  })
);

// TODO: DO NOT CACHE root request
workbox.routing.registerRoute(
  new RegExp("^.*notamweb.aviation-civile.gouv.fr"),
  new workbox.strategies.NetworkOnly({
    networkTimeoutSeconds: 10,
    plugins: [MixedContentPlugin, CorsProxyPlugin]
  }),
  "POST"
);

///////////////////////////// Leaflet & images ////////////////////////////////////////////////////

workbox.routing.registerRoute(
  ({ request }) => request.destination === "image",
  new workbox.strategies.CacheFirst({
    cacheName: `${CACHE_PREFIX}_images`,
    plugins: [MonthlyExpirationPlugin]
  })
);
