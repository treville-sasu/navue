importScripts("/precache-manifest.2b3cd5bad09ab156b2439705c15491de.js", "https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js");

!function(e){var t={};function r(o){if(t[o])return t[o].exports;var n=t[o]={i:o,l:!1,exports:{}};return e[o].call(n.exports,n,n.exports,r),n.l=!0,n.exports}r.m=e,r.c=t,r.d=function(e,t,o){r.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:o})},r.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},r.t=function(e,t){if(1&t&&(e=r(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var o=Object.create(null);if(r.r(o),Object.defineProperty(o,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var n in e)r.d(o,n,function(t){return e[t]}.bind(null,n));return o},r.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return r.d(t,"a",t),t},r.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},r.p="",r(r.s=0)}([function(e,t,r){e.exports=r(1)},function(e,t){async function r(e,t){const r=t.headers.get("Content-Type")?await t.blob():void 0;return new Request(e,{method:t.method,headers:t.headers,body:r,mode:t.mode,credentials:t.credentials,cache:t.cache,redirect:t.redirect,referrer:t.referrer,integrity:t.integrity})}workbox.core.setCacheNameDetails({prefix:"naVue"}),self.addEventListener("activate",()=>{self.clients.claim()}),self.addEventListener("message",e=>{e.data&&"SKIP_WAITING"===e.data.type&&self.skipWaiting()}),self.__precacheManifest=[].concat(self.__precacheManifest||[]),workbox.precaching.precacheAndRoute(self.__precacheManifest,{});const o={requestWillFetch:async({request:e})=>{const t=new URL(e.url);return t.protocol="http:",await r(t.toString(),e)}},n={requestWillFetch:async({request:e})=>{const t=new URL("https://navue-proxy.treville.workers.dev/");return t.search=new URLSearchParams({cors:e.url}),await r(t.toString(),e)}},i=new workbox.expiration.Plugin({maxEntries:100,maxAgeSeconds:2592e3,purgeOnQuotaError:!0}),a=new workbox.expiration.Plugin({maxEntries:100,maxAgeSeconds:86400,purgeOnQuotaError:!0});workbox.routing.registerNavigationRoute(workbox.precaching.getCacheKeyForURL("/index.html")),workbox.routing.registerRoute(({request:e})=>["font","styles"].includes(e.destination),new workbox.strategies.StaleWhileRevalidate({cacheName:"naVue_ui_assets"})),workbox.routing.registerRoute(new RegExp("^.*aviation.meteo.fr"),new workbox.strategies.NetworkFirst({cacheName:"naVue_aeroweb",networkTimeoutSeconds:10,plugins:[n,a]})),workbox.routing.registerRoute(new RegExp("^.*www.sia.aviation-civile.gouv.fr/pub"),new workbox.strategies.NetworkFirst({cacheName:"naVue_SIA_AZBA",networkTimeoutSeconds:10,plugins:[n,a]})),workbox.routing.registerRoute(new RegExp("^.*www.sia.aviation-civile.gouv.fr/dvd"),new workbox.strategies.NetworkFirst({cacheName:"naVue_SIA_VAC",networkTimeoutSeconds:10,plugins:[n,i]})),workbox.routing.registerRoute(new RegExp("^.*www.sia.aviation-civile.gouv.fr"),new workbox.strategies.NetworkOnly({plugins:[n]})),workbox.routing.registerRoute(new RegExp("^.*notamweb.aviation-civile.gouv.fr"),new workbox.strategies.NetworkOnly({networkTimeoutSeconds:10,plugins:[o,n]}),"POST"),workbox.routing.registerRoute(({request:e})=>"image"===e.destination,new workbox.strategies.CacheFirst({cacheName:"naVue_images",plugins:[i]}))}]);
