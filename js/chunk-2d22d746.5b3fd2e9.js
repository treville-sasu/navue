(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-2d22d746"],{f820:function(e,t,a){"use strict";a.r(t);var render=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("section",{staticClass:"section"},[e._m(0),a("div",{staticClass:"tile is-ancestor"},[a("div",{staticClass:"tile is-4 is-vertical is-parent"},[a("div",{staticClass:"tile is-child box"},[a("h2",{staticClass:"title"},[e._v("What is it ?")]),e._m(1),a("p",{staticClass:"block"},[e._v(" Gather all your flight information on very few clicks. Collect data on your flight. use it for briefing and debriefing. ")]),a("p",{staticClass:"block"},[e._v(" With navue we aim at a multiplatform, directly usable (no installation, no download, no update), source of information, and quick route planning. ")]),a("p",{staticClass:"block"},[e._v(" Modern web technology allow for in browser experience very similar as insalled app. For support and compatibility check your browser "),a("router-link",{attrs:{to:"#compat"}},[e._v("here")])],1)]),a("div",{staticClass:"tile is-child box"},[a("h2",{staticClass:"title"},[e._v("Who build it ?")]),a("p",{staticClass:"block"},[e._v(" As a fresh private pilot, and as advanced internet user, I found a lack of good, easly & directly usable product for VFR flight. ")]),a("p",{staticClass:"block"},[e._v(" As any open source project you can contribute to it. ")]),a("b-button",{attrs:{tag:"a",href:"https://github.com/treville-sasu/navue",target:"_blank","icon-left":"github",size:"is-large"}},[e._v(" Get Involved ! ")])],1)]),a("div",{staticClass:"tile is-vertical is-parent"},[a("div",{staticClass:"tile is-child box",attrs:{id:"compat"}},[a("h2",{staticClass:"title"},[e._v("Compatibility & browser support")]),e._m(2),a("button",{staticClass:"button is-primary",on:{click:function(t){e.isBrowserCheckActive=!0}}},[e._v(" Check my browser ")]),a("b-modal",{attrs:{"trap-focus":"","can-cancel":""},model:{value:e.isBrowserCheckActive,callback:function(t){e.isBrowserCheckActive=t},expression:"isBrowserCheckActive"}},[a("browser-check")],1),e._m(3),e._v(" If you ask for help, you will be asked for a version or build number, just use this one : "),a("b-taglist",{attrs:{attached:""}},[a("b-tag",{attrs:{type:"is-dark"}},[e._v(e._s(e.version))]),a("b-tag",{attrs:{type:"is-info"}},[e._v(e._s(e.build))])],1),a("pre")],1)]),e._m(4)])])},i=[function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("h1",{staticClass:"title"},[e._v("All about "),a("b",[e._v("naVue")]),e._v("...")])},function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("p",{staticClass:"block"},[a("b",[e._v("naVue")]),e._v(" is an open source software dedicated to VFR pilots who need to prepare a flight with ease. ")])},function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("p",{staticClass:"block"},[a("b",[e._v("naVue")]),e._v(" use latest technologies and needs a modern browser. You'll find below a compatibility check for your current browser, and some proposals for best experience. ")])},function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{staticClass:"notification is-primary is-light"},[a("p",{staticClass:"block"},[e._v(" Currently we aim to support the last three versions of the three major browser : Chrome, Firefox and Edge. ")]),a("p",{staticClass:"block"},[e._v(" We explicitly exclude : Internet Explorer, Baidu browser & Opera Mini. ")])])},function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{staticClass:"tile is-vertical is-parent",attrs:{id:"legal"}},[a("div",{staticClass:"tile is-child box"},[a("h1",{staticClass:"title"},[e._v("Liability.")]),a("h2",{staticClass:"subtitle has-text-warning\t"},[e._v(" Always use offical documentation. ")]),a("p",{staticClass:"block"},[e._v(" As a pilot in command you will be the only liable person of your flight and aircraft. You are responsible for the documents and informations you use in flight. ")]),a("p",{staticClass:"block"},[e._v(" We gather imformations in our best abilities, but important informations may be missing or outdated. ")])]),a("div",{staticClass:"tile is-child box"},[a("h2",{staticClass:"title"},[e._v("Licences")]),a("p",{staticClass:"block"},[e._v(" https://fontawesome.com/license ")]),a("p",{staticClass:"block"},[e._v(" Vuejs, Leaflet, Mapbox, ... Meteofrance, SIA https://materialdesignicons.com/ ")])])])}],BrowserCheckvue_type_template_id_276dc862_render=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("b-table",{attrs:{data:e.featureDetection,striped:!0}},[a("b-table-column",{attrs:{field:"api",label:"Which Tech"},scopedSlots:e._u([{key:"default",fn:function(t){return[e._v(" "+e._s(t.row.api)+" ")]}}])}),a("b-table-column",{attrs:{field:"feature",label:"Feature"},scopedSlots:e._u([{key:"default",fn:function(t){return[e._v(" "+e._s(t.row.feature)+" ")]}}])}),a("b-table-column",{attrs:{label:"Support",field:"test",centered:!0},scopedSlots:e._u([{key:"default",fn:function(e){return[a("span",[a("b-icon",{attrs:{icon:e.row.test?"check-decagram":"alert-decagram-outline",type:e.row.test?"is-success":e.row.required?"is-danger":"is-warning"}})],1)]}}])})],1)},s=[],r={name:"BrowserCheck",data(){return{search:""}},computed:{featureDetection(){return[{api:"Service Worker",feature:"Internet request handling",test:"serviceWorker"in navigator,required:!0},{api:"Cache",feature:"Allow caching for app, charts and weather maps.",test:"caches"in self,required:!0},{api:"Geolocation",feature:"Get your location with a GNSS",test:"geolocation"in navigator},{api:"Fullscreen",feature:"Set a map fullscreen",test:"requestFullscreen"in document.documentElement},{api:"WakeLock",feature:"Keep your screen on while flying",test:"wakeLock"in navigator&&"visible"===document.visibilityState},{api:"App Installation",feature:"Add the app to your Home screen",test:"BeforeInstallPromptEvent"in window||"setAppBadge"in navigator},{api:"Online State",feature:"Better online/offline switch",test:"onLine"in navigator},{api:"IndexedDB",feature:"Local database for data synchronisation",test:"indexedDB"in window,required:!0},{api:"Storage",feature:"In browser storage management",test:"storage"in navigator&&"estimate"in navigator.storage},{api:"Device Motion",feature:"Get rotation & acceleration measurement",test:"LinearAccelerationSensor"in window&&"Gyroscope"in window||"DeviceMotionEvent"in window}]}}},o=r,n=a("2877"),l=Object(n["a"])(o,BrowserCheckvue_type_template_id_276dc862_render,s,!1,null,null,null),c=l.exports,u={name:"About",components:{BrowserCheck:c},data(){return{version:"0.1.2",build:"3014937-dirty\n",isBrowserCheckActive:!1}}},d=u,p=Object(n["a"])(d,render,i,!1,null,null,null);t["default"]=p.exports}}]);