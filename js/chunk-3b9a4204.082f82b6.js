(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-3b9a4204"],{"263c":function(t,e,n){"use strict";var i=n("c105"),o=n.n(i);o.a},"30d1":function(t,e,n){"use strict";var i=n("b7de"),o=n.n(i);o.a},3935:function(t,e,n){"use strict";n.r(e);var render=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("section",{staticStyle:{height:"100%"}},[n("l-map",t._b({ref:"movingMap",on:{ready:t.setupMap,contextmenu:t.setDestination}},"l-map",t.settings.map,!1),[n("l-moving-map-settings-control",t._b({attrs:{position:"topleft"},on:{"update:settings":t.updateSettings,"delete-track":t.removeLocations}},"l-moving-map-settings-control",t.settings,!1)),t.settings.zoomControl?n("l-control-zoom",{attrs:{position:"topleft"}}):t._e(),t.settings.inFlight?t._e():n("l-moving-map-toolbox-control",{attrs:{position:"bottomleft"},on:{"update:settings":t.updateSettings}}),n("l-moving-map-instruments-control",t._b({attrs:{position:"topright"}},"l-moving-map-instruments-control",t.lastKnownLocation,!1)),t.lastKnownLocation&&t.destination?n("l-moving-map-destination-control",{attrs:{from:t.lastKnownLocation,to:t.destination,position:"bottomleft"}}):t._e(),n("l-time-control",{attrs:{position:"bottomright"},on:{"update:settings":t.updateSettings}}),n("l-base-layer-group"),n("l-location-marker",{attrs:{value:t.lastKnownLocation,delay:t.settings.futurPositionDelay}}),t.trace?n("l-polyline",{attrs:{"lat-lngs":t.trace,className:"traceLine"}}):t._e(),t._l(t.routes,(function(e,i){return n("l-route-layer-group",{key:i,attrs:{value:e.items,active:!1},on:{"contextmenu-waypoint":function(n){return t.setDestination(e.items[n])}}})})),n("l-destination-marker",{attrs:{origin:t.lastKnownLocation},model:{value:t.destination,callback:function(e){t.destination=e},expression:"destination"}})],2)],1)},i=[],o=(n("29ae"),n("6cc5"),n("2699")),a=n("c8b6"),s=n("635f"),r=n("f9de"),l=n("08df");const c={data(){return{geoOptions:{watch:!0,enableHighAccuracy:!0,timeout:5e3,maximumAge:1e3},settings:{maxAccuracy:150,minSpeed:1e3/3600,minDistance:1}}},mixins:[l["c"]],methods:{stopLocate(){this.map.stopLocate(),this.lastKnownLocation=void 0},startLocate(){this.map.locate(this.geoOptions)},_locationFound(t){let e=r["a"].fromLocate(t);try{if(e.accuracy>this.settings.maxAccuracy)throw{...e,type:"locationerror",message:`Geolocation error: too low accuracy (${e.accuracy}m)`}}catch(n){return void this._locationError(n)}if(!(this.lastKnownLocation instanceof r["a"]&&e.distanceTo(this.lastKnownLocation)<=this.settings.minDistance)&&(this.lastKnownLocation instanceof r["a"]&&Object.assign(e,e.movementFrom(this.lastKnownLocation)),e.altitude&&e.altitude.accuracy>this.settings.maxAccuracy&&(e.altitude=void 0),e.speed<this.settings.minSpeed&&(e.speed=void 0,e.heading=void 0),this.lastKnownLocation=e,this.settings.setView&&this.bestView(e),this.settings.inFlight)){this.addLocation(e);const t=this.getDestination(e);t&&this.setDestination(t)}},_locationError(t){delete t.sourceTarget,delete t.target,this.lastKnownError={...t},this.openWarning(t.message,"Stop GNSS",()=>this.settings.getLocation=!1)},_fakeLocation({latitude:t=0,longitude:e=0,accuracy:n=20,altitude:i=1e3}){console.debug("Faking around:",{latitude:t,longitude:e,altitude:i});let rand=(t=1)=>(Math.random()-.5)*t;return{latitude:t+rand(),longitude:e+rand(),accuracy:n+rand(),altitude:i+rand(10),altitudeAccuracy:n+rand(),timestamp:Date.now()}}}};var u=n("a75e"),LMovingMapSettingsControlvue_type_template_id_1f61a926_render=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("l-control",t._b({},"l-control",t.$attrs,!1),[n("b-dropdown",[n("b-button",{attrs:{slot:"trigger"},slot:"trigger"},[n("b-icon",{attrs:{icon:"cog-outline"}})],1),n("b-dropdown-item",{attrs:{custom:""}},[n("b-switch",{attrs:{value:t.getLocation},on:{input:function(e){return t.$emit("update:settings",{getLocation:e})}}},[t._v("Use GNSS")])],1),n("b-dropdown-item",{attrs:{custom:""}},[n("b-switch",{attrs:{value:t.setView,disabled:!t.getLocation},on:{input:function(e){return t.$emit("update:settings",{setView:e})}}},[t._v("Keep view centered")])],1),n("b-dropdown-item",{attrs:{custom:""}},[n("b-switch",{attrs:{value:t.fullScreen},on:{input:function(e){return t.$emit("update:settings",{fullScreen:e})}}},[t._v("Set Map Fullscreen")])],1),n("b-dropdown-item",{attrs:{custom:""}},[n("b-switch",{attrs:{value:t.zoomControl},on:{input:function(e){return t.$emit("update:settings",{zoomControl:e})}}},[t._v("Display zoom control")])],1),n("b-dropdown-item",{on:{click:function(e){return t.$emit("delete-track")}}},[n("b-icon",{attrs:{icon:"map-marker-remove-outline"}}),t._v("Delete trace ")],1)],1)],1)},m=[],d=n("2253"),p={name:"LMovingMapSettingsControl",components:{LControl:d["a"]},props:{getLocation:Boolean,setView:Boolean,fullScreen:Boolean,zoomControl:Boolean,inFlight:Boolean}},g=p,h=n("2877"),v=Object(h["a"])(g,LMovingMapSettingsControlvue_type_template_id_1f61a926_render,m,!1,null,null,null),f=v.exports,LMovingMapToolboxControlvue_type_template_id_504f4a85_render=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("l-control",t._b({},"l-control",t.$attrs,!1),[n("div",{staticClass:"buttons has-addons"},[n("NavigationManager",{attrs:{position:"is-top-right"},scopedSlots:t._u([{key:"default",fn:function(){return[n("b-button",[n("b-icon",{attrs:{icon:"map-marker-path"}})],1)]},proxy:!0},{key:"header",fn:function(e){var n=e.selected;return[t._v(" "+t._s(n.name)+" ")]}}])}),n("b-button",{attrs:{tag:"router-link",to:"NavLog"}},[n("b-icon",{attrs:{icon:"clipboard-list-outline"}})],1),n("b-button",{attrs:{tag:"router-link",to:"Checklists"}},[n("b-icon",{attrs:{icon:"list-status"}})],1)],1)])},b=[],_=n("f2f1"),L={name:"LMovingMapToolboxControl",components:{LControl:d["a"],NavigationManager:_["a"]}},y=L,w=Object(h["a"])(y,LMovingMapToolboxControlvue_type_template_id_504f4a85_render,b,!1,null,null,null),T=w.exports,LMovingMapInstrumentsControlvue_type_template_id_4933460e_render=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("l-control",t._b({},"l-control",t.$attrs,!1),[n("b-taglist",[n("b-tag",{attrs:{type:"is-primary",size:"is-medium"}},[t._v(t._s(t._f("as")(t.speed,"kt",2)))]),n("b-tag",{attrs:{type:"is-success",size:"is-medium"}},[t._v(t._s(t._f("as")(t.heading,"°",2)))]),n("b-tag",{attrs:{type:"is-info",size:"is-medium"}},[t._v(t._s(t._f("as")(t.altitude,"ft",2)))]),n("b-tag",{attrs:{type:"is-dark",size:"is-medium"}},[t._v(t._s(t._f("as")(t.verticalSpeed,"ft/min",2)))])],1)],1)},C=[],k=n("2e0e"),x={name:"LMovingMapInstrumentsControl",mixins:[k["a"]],components:{LControl:d["a"]},props:["altitude","heading","speed","verticalSpeed"]},D=x,M=Object(h["a"])(D,LMovingMapInstrumentsControlvue_type_template_id_4933460e_render,C,!1,null,null,null),S=M.exports,LMovingMapDestinationControlvue_type_template_id_3c69bbc8_render=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("l-control",t._b({},"l-control",t.$attrs,!1),[n("b-taglist",[n("b-tag",{attrs:{type:"is-primary",size:"is-medium"}},[t._v(t._s(t._f("as")(t.distance,"NM")))]),n("b-tag",{attrs:{type:"is-success",size:"is-medium"}},[t._v(t._s(t.heading))]),n("b-tag",{attrs:{type:"is-info",size:"is-medium"}},[t._v(t._s(t._f("as")(t.to.altitude,"ft")))]),n("b-tag",{attrs:{type:"is-light",size:"is-medium"}},[t._v(t._s(t._f("as")(t.vertical_speed,"m/s")))]),n("b-tag",{attrs:{type:"is-dark",size:"is-medium"}},[t._v("ETE "+t._s(t._f("asDuration")(t.ETE)))])],1)],1)},E=[],$=n("3634"),F={name:"LMovingMapDestinationControl",components:{LControl:d["a"]},props:{from:Object,to:Object},mixins:[k["a"]],computed:{distance(){return this.from.distanceTo(this.to)},ETE(){return this.distance/this.from.speed},heading(){return this.from.bearingTo(this.to)},vertical_speed(){return new $["e"]((this.to.altitude-this.from.altitude)/this.ETE,"m/s")}}},z=F,O=Object(h["a"])(z,LMovingMapDestinationControlvue_type_template_id_3c69bbc8_render,E,!1,null,null,null),K=O.exports,LTimeControlvue_type_template_id_2f171119_scoped_true_render=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("l-control",t._b({},"l-control",t.$attrs,!1),[n("nav",{staticClass:"level is-mobile box"},[n("div",{staticClass:"level-item has-text-centered"},[n("div",[n("p",{staticClass:"heading"},[n("b-icon",{attrs:{type:t.isEnroute?"is-danger":"is-primary",icon:t.isEnroute?"airplane-landing":"airplane-takeoff"}})],1),n("p",{staticClass:"title is-clickable",on:{click:function(e){!t.isEnroute&&t.startFlight()},contextmenu:function(e){e.preventDefault(),e.stopPropagation(),t.isEnroute&&t.stopFlight()}}},[t._v(" "+t._s(t._f("asDuration")(t.fromStart))+" ")])])]),n("div",{staticClass:"level-item has-text-centered"},[n("div",[n("p",{staticClass:"heading"},[n("b-icon",{attrs:{icon:"timer-outline",type:t.chronoTime?"is-danger":"is-primary"}})],1),n("p",{staticClass:"title is-clickable",on:{click:t.startChrono,contextmenu:function(e){return e.preventDefault(),e.stopPropagation(),t.stopChrono(e)}}},[t._v(" "+t._s(t._f("asDuration")(t.chrono))+" ")])])]),n("div",{staticClass:"level-item has-text-centered"},[n("div",[n("p",{staticClass:"heading"},[n("b-icon",{attrs:{icon:"alarm-plus"}})],1),n("div",{staticClass:"is-clickable timelist",on:{click:function(e){return e.stopPropagation(),t.addTime(e)},contextmenu:function(e){return e.preventDefault(),e.stopPropagation(),t.removeTime(e)}}},[n("ul",t._l(t.markedTimes,(function(e){return n("li",{key:e},[t._v(" "+t._s(t._f("asDuration")(e))+" ")])})),0),n("span",{staticClass:"title"},[t._v(" - ")])])])])])])},j=[],N={name:"LTimeControl",components:{LControl:d["a"]},mixins:[k["a"]],data(){return{startTime:void 0,endTime:void 0,currentTime:void 0,currentUpdater:void 0,chronoTime:void 0,markedTimes:[]}},mounted(){this.currentUpdater=setInterval(()=>{this.currentTime=Date.now()},1e3)},destroyed(){clearInterval(this.currentUpdater)},computed:{isEnroute(){return!!this.startTime&&!this.endTime},fromStart(){return this.endTime?this.endTime-this.startTime:this.startTime?Math.max(0,this.currentTime-this.startTime):null},chrono(){return this.chronoTime?Math.max(0,this.currentTime-this.chronoTime):null},timesCount(){return this.markedTimes.length}},methods:{startFlight(){this.endTime=void 0,this.startTime=Date.now(),this.$emit("update:settings",{inFlight:this.isEnroute})},stopFlight(){this.endTime=Date.now(),this.$emit("update:settings",{inFlight:this.isEnroute})},startChrono(){this.chronoTime=Date.now()},stopChrono(){this.chronoTime=void 0},addTime(){this.markedTimes.unshift(Date.now())},removeTime(){this.markedTimes.shift()}}},V=N,B=(n("5517"),Object(h["a"])(V,LTimeControlvue_type_template_id_2f171119_scoped_true_render,j,!1,null,"2f171119",null)),P=B.exports,LLocationMarkervue_type_template_id_513f418e_render=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("l-layer-group",[t.value.latlng?n("l-marker",{attrs:{"lat-lng":t.value.latlng}},[n("l-icon",{attrs:{"class-name":"leaflet-diamond-icon"}},[n("div")])],1):t._e(),t.value.latlng&&t.value.accuracy?n("l-circle",{attrs:{"lat-lng":t.value.latlng,radius:t.value.accuracy,className:"accuracyCircle"}}):t._e(),this.value.latlng&&this.value.heading&&this.value.speed?n("l-polyline",{attrs:{"lat-lngs":t.speedVector,className:"speedVector"}}):t._e()],1)},G=[],I=n("1ebb"),A=n("4e2b"),J=n("fbba"),U=n("0dbd"),W={name:"LLocationMarker",components:{LLayerGroup:I["a"],LMarker:A["a"],LIcon:J["a"],LPolyline:s["a"],LCircle:U["a"]},props:{value:{type:Object,default:()=>({latlng:null,speed:null,heading:null,accuracy:null})},delay:{type:Number,default:()=>60}},computed:{speedVector(){return[this.value.latlng,this.value.positionInSeconds(this.delay).latlng]}}},q=W,H=(n("3e8f"),Object(h["a"])(q,LLocationMarkervue_type_template_id_513f418e_render,G,!1,null,null,null)),R=H.exports,LDestinationMarkervue_type_template_id_04814519_render=function(){var t=this,e=t.$createElement,n=t._self._c||e;return t.origin&&t.value?n("span",[n("l-layer-group",[n("l-marker",{attrs:{"lat-lng":t.value.latlng},on:{contextmenu:function(e){return t.$emit("input")}}},[n("l-icon",{attrs:{"class-name":"leaflet-destination-icon"}},[n("div")])],1),n("l-polyline",{attrs:{"lat-lngs":t.destinationVector,className:"destinationVector"}})],1)],1):t._e()},Z=[],Q=n("ef62"),X={name:"LDestinationMarker",components:{LLayerGroup:I["a"],LMarker:A["a"],LIcon:J["a"],LPolyline:s["a"]},props:["value","origin"],mounted(){this.map=Object(Q["d"])(this.$parent,!0).mapObject},computed:{destinationVector(){return[this.origin.latlng,this.value.latlng]}}},Y=X,tt=(n("263c"),Object(h["a"])(Y,LDestinationMarkervue_type_template_id_04814519_render,Z,!1,null,null,null)),et=tt.exports,nt=n("2cec"),it={name:"MovingMap",components:{LMap:o["a"],LControlZoom:a["a"],LPolyline:s["a"],LBaseLayerGroup:u["a"],LMovingMapSettingsControl:f,LMovingMapToolboxControl:T,LMovingMapInstrumentsControl:S,LMovingMapDestinationControl:K,LTimeControl:P,LLocationMarker:R,LRouteLayerGroup:nt["a"],LDestinationMarker:et},mixins:[l["d"],c],data(){return{lastKnownLocation:void 0,lastKnownError:void 0,destination:void 0,traceDB:"navue_trace",traceType:"Location",settings:{getLocation:!0,setView:!0,fullScreen:!!document.fullscreenElement,zoomControl:!1,inFlight:!1,navigationSelect:!1,traceLength:200,minDestination:100,futurPositionDelay:180,map:{zoom:10,center:{lat:42.69597591582309,lng:2.879308462142945},options:{zoomSnap:.5,zoomControl:!1,attributionControl:!1}}}}},beforeDestroy(){this.stopLocate()},computed:{map(){return this.$refs.movingMap.mapObject},trace(){return(this.reportedLocations||[]).map(t=>[t.latitude,t.longitude])},navigation(){return this.$store.state.currentNavigation},routes(){return this.navigation?this.navigation.routes:[]}},watch:{"settings.setView":function(t){t&&this.lastKnownLocation&&this.bestView(this.lastKnownLocation)},"settings.fullScreen":function(t){this.toggleFullscreen(this.map.getContainer(),t)},"settings.getLocation":function(t){t?this.startLocate():this.stopLocate()},"settings.inFlight":function(t){this.settings.fullScreen=t},navigation(t){try{let e=t.toBounds();this.map.flyToBounds(e,{padding:[50,50]})}catch{}}},pouch:{reportedLocations(){return{database:this.traceDB,limit:this.settings.traceLength,selector:{type:this.traceType},sort:["timestamp"]}}},methods:{setupMap(t){t.on("locationfound",this._locationFound,this).on("locationerror",this._locationError,this),this.settings.getLocation&&this.startLocate()},bestView(t){let e=t.toBounds(t.speed?t.speed*this.settings.futurPositionDelay:t.accuracy);this.map.flyToBounds(e,{padding:[100,100]})},addLocation(t){let e=JSON.parse(JSON.stringify(t));return e._id=t.timestamp.toString(),this.$pouch[this.traceDB].put(e,{})},removeLocations(){this.$pouch[this.traceDB].destroy().then(()=>{let t=this.traceType;this.traceType=null,this.traceType=t}).catch(console.error)},setDestination({latlng:t,latitude:e,longitude:n,altitude:i}={}){this.destination=r["b"].from({latlng:t,latitude:e,longitude:n,altitude:i,type:"Waypoint"})},getDestination(t){this.destination&&t.distanceTo(this.destination)<this.settings.minDestination&&(this.destination=this.navigation.getNextWaypoint(this.destination))},updateSettings(t){this.settings={...this.settings,...t}},toggleFullscreen(t,e){void 0==e?document.fullscreenElement?document.exitFullscreen():t.requestFullscreen():e?t.requestFullscreen():document.exitFullscreen()}}},ot=it,at=(n("30d1"),Object(h["a"])(ot,render,i,!1,null,null,null));e["default"]=at.exports},"3e8f":function(t,e,n){"use strict";var i=n("847f"),o=n.n(i);o.a},5517:function(t,e,n){"use strict";var i=n("a14b"),o=n.n(i);o.a},"847f":function(t,e,n){},a14b:function(t,e,n){},b7de:function(t,e,n){},c105:function(t,e,n){}}]);