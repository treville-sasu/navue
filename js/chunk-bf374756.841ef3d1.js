(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-bf374756"],{"0223":function(t,e,a){"use strict";var i=a("ae67"),n=a.n(i);n.a},"0f66":function(t,e,a){},1849:function(t,e,a){"use strict";var i=a("0f66"),n=a.n(i);n.a},"30d1":function(t,e,a){"use strict";var i=a("b7de"),n=a.n(i);n.a},3935:function(t,e,a){"use strict";a.r(e);var i=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("section",{staticStyle:{height:"100%"}},[a("NavigationSelect"),a("AircraftSelect"),a("l-map",{ref:"movingMap",attrs:{options:{zoomSnap:.5}},on:{ready:t.setupMap,contextmenu:t.setDestination}},[a("l-base-layer-group"),a("l-control-fullscreen",{attrs:{position:"topleft"}}),a("l-moving-map-toolbox-control",{attrs:{position:"bottomleft"},on:{"delete-track":t.removeLocations},model:{value:t.settings,callback:function(e){t.settings=e},expression:"settings"}}),a("l-moving-map-instruments-control",{attrs:{position:"topright"},model:{value:t.lastKnownLocation,callback:function(e){t.lastKnownLocation=e},expression:"lastKnownLocation"}}),t.lastKnownLocation&&t.destination?a("l-moving-map-destination-control",{attrs:{from:t.lastKnownLocation,to:t.destination,position:"bottomright"}}):t._e(),a("l-location-marker",{attrs:{delay:t.futurPositionDelay},model:{value:t.lastKnownLocation,callback:function(e){t.lastKnownLocation=e},expression:"lastKnownLocation"}}),t.trace?a("l-polyline",{attrs:{"lat-lngs":t.trace,className:"traceLine"}}):t._e(),t._l(t.navigation.routes,(function(e,i){return a("l-route-layer-group",{key:i,attrs:{value:e,active:!1},on:{"contextmenu-waypoint":function(a){return t.setDestination(e[a])}}})})),a("l-destination-marker",{attrs:{origin:t.lastKnownLocation},model:{value:t.destination,callback:function(e){t.destination=e},expression:"destination"}})],2)],1)},n=[],o=(a("29ae"),a("6cc5"),a("2699")),s=a("635f"),l=a("c222"),r=a("f9de");const c={data(){return{maxAccuracy:150,minSpeed:1e3/3600,minDistance:1,geoOptions:{watch:!0,enableHighAccuracy:!0,timeout:5e3,maximumAge:1e3}}},methods:{stopLocate(){this.map.stopLocate()},startLocate(){this.map.locate(this.geoOptions)},_locationFound(t){let e=r["a"].from(t);try{if(e.accuracy>this.maxAccuracy)throw{type:"locationerror",message:`Geolocation error: too low accuracy (${e.accuracy}m)`};if(this.lastKnownLocation instanceof r["a"]&&e.distanceTo(this.lastKnownLocation)<=this.minDistance)throw{type:"locationerror",message:"Geolocation error: still fixing."}}catch(a){this._locationError(a)}if(this.lastKnownLocation instanceof r["a"]&&(e.lastLocation=this.lastKnownLocation),e.altitude.accuracy>this.maxAccuracy&&(e.altitude={}),e.speed<this.minSpeed&&(e.speed=void 0,e.heading=void 0),this.lastKnownLocation=e,this.settings.setView&&this.bestView(e),this.settings.inFlight){this.addLocation(e);const t=this.getDestination(e);t&&this.setDestination(t)}},_locationError(t){return new Promise((e,a)=>{delete t.sourceTarget,delete t.target,this.lastKnownError={...t},this.settings.allowWarning&&this.openWarning(t),a({...t})})},_fakeLocation({latlng:t={lat:0,lng:0},accuracy:e=20,altitude:a=1e3},i=5){let n=(t=i)=>(Math.random()-.5)*t;return r["a"].from({type:"locationfaked",latitude:t.lat+n(i/100),longitude:t.lng+n(i/100),accuracy:e+n(e*i/100),altitude:a+n(a*i/100),altitudeAccuracy:e+n(e*i/100),timestamp:Date.now()})}}};var u=a("cd48"),p=a("b4f7"),d=a("b8bf"),m=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("l-control",t._b({},"l-control",t.$attrs,!1),[a("b-field",[a("b-dropdown",{attrs:{position:"is-top-right"}},[a("p",{staticClass:"control",attrs:{slot:"trigger"},slot:"trigger"},[a("button",{staticClass:"button"},[a("b-tooltip",{attrs:{label:"Settings"}},[a("b-icon",{attrs:{icon:"cog-outline"}})],1)],1)]),a("b-dropdown-item",[a("b-switch",{model:{value:t.value.getLocation,callback:function(e){t.$set(t.value,"getLocation",e)},expression:"value.getLocation"}},[t._v("Use GNSS")])],1),a("b-dropdown-item",[a("b-switch",{attrs:{disabled:!t.value.getLocation},model:{value:t.value.setView,callback:function(e){t.$set(t.value,"setView",e)},expression:"value.setView"}},[t._v("Keep view centered")])],1),a("b-dropdown-item",[a("b-switch",{attrs:{disabled:!t.wakeLockable},model:{value:t.value.wakeLock,callback:function(e){t.$set(t.value,"wakeLock",e)},expression:"value.wakeLock"}},[t._v("Keep screen On")])],1),a("b-dropdown-item",[a("b-button",{attrs:{size:"is-small","icon-right":"map-marker-remove-outline",outlined:"",expanded:""},on:{click:function(e){return t.$emit("delete-track")}}},[t._v("Delete trace")])],1),a("b-dropdown-item",[a("b-switch",{model:{value:t.value.allowWarning,callback:function(e){t.$set(t.value,"allowWarning",e)},expression:"value.allowWarning"}},[t._v("Display warnings")])],1)],1),t.value.inFlight?[a("p",{staticClass:"control"},[a("button",{staticClass:"button",on:{click:function(e){t.value.inFlight=!1}}},[a("b-tooltip",{attrs:{label:"Stop"}},[a("b-icon",{attrs:{type:"is-danger",icon:"airplane-landing"}})],1)],1)])]:[a("p",{staticClass:"control"},[a("button",{staticClass:"button",on:{click:function(e){return t.$store.commit("navigationSelect",!0)}}},[a("b-tooltip",{attrs:{label:"Select a navigation"}},[a("b-icon",{attrs:{icon:"map-marker-path"}})],1)],1)]),a("p",{staticClass:"control"},[a("button",{staticClass:"button",on:{click:function(e){return t.$store.commit("aircraftSelect",!0)}}},[a("b-tooltip",{attrs:{label:"Select an aircraft"}},[a("b-icon",{attrs:{icon:"airplane"}})],1)],1)]),a("p",{staticClass:"control"},[a("button",{staticClass:"button",on:{click:function(e){t.value.inFlight=!0}}},[a("b-tooltip",{attrs:{label:"Start"}},[a("b-icon",{attrs:{icon:"airplane-takeoff"}})],1)],1)]),a("p",{staticClass:"control"},[a("button",{staticClass:"button",attrs:{disabled:""},on:{click:function(e){return t.$store.commit("traceSelect",!0)}}},[a("b-tooltip",{attrs:{label:"Save trace"}},[a("b-icon",{attrs:{icon:"map-marker-plus-outline"}})],1)],1)])],t.aircraft?a("p",{staticClass:"control"},[a("button",{staticClass:"button",on:{click:function(e){return t.openModal("Checklists",{checklists:t.aircraft.checklists,paces:t.aircraft.paces})}}},[t._v(" > "),a("b-tooltip",{attrs:{label:"Checklist"}},[a("b-icon",{attrs:{icon:"clipboard-list-outline"}})],1)],1)]):t._e()],2)],1)},h=[],g=a("2253"),b=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("b-tabs",{staticClass:"box",attrs:{multiline:""},model:{value:t.currentCL,callback:function(e){t.currentCL=e},expression:"currentCL"}},[t.paces?a("b-tab-item",{attrs:{label:"Paces"}},[a("div",{staticClass:"columns"},t._l(t.paces,(function(e){return a("div",{key:e.name,staticClass:"column"},[a("div",{staticClass:"notification is-primary"},[a("h1",{staticClass:"title"},[a("b",[t._v(t._s(t._f("to")(e)))]),t._v(" "+t._s(e.unit)+" ")]),a("h2",{staticClass:"subtitle"},[t._v(" "+t._s(e.name)+" ")])])])})),0)]):t._e(),t._l(t.checklists,(function(e){return a("b-tab-item",{key:e.name,attrs:{label:e.name}},[a("b-table",{attrs:{data:e.items,checkable:"","is-row-checkable":function(t){return!!t.expect},"checkbox-position":"right","checked-rows":t.checked,"header-checkable":!1,"mobile-cards":!1,"row-class":function(t,e){return t.action&&"is-selected"}},on:{"update:checkedRows":function(e){t.checked=e},"update:checked-rows":function(e){t.checked=e}},scopedSlots:t._u([{key:"empty",fn:function(){return[a("section",{staticClass:"section"},[a("div",{staticClass:"content has-text-grey has-text-centered"},[a("p",[t._v("Nothing here. Configure the aircraft first.")])])])]},proxy:!0},{key:"bottom-left",fn:function(){return[a("b-button",{attrs:{type:"is-primary"},on:{click:function(e){t.currentCL=(t.currentCL+1)%t.checklists.length}}},[t._v("Next C/L")])]},proxy:!0}],null,!0)},[a("b-table-column",{attrs:{field:"name",label:"Name"},scopedSlots:t._u([{key:"default",fn:function(e){return[t._v(t._s(e.row.name))]}}],null,!0)}),a("b-table-column",{attrs:{field:"expect",label:"Expectation"},scopedSlots:t._u([{key:"default",fn:function(e){return[t._v(t._s(e.row.expect))]}}],null,!0)})],1)],1)}))],2)},v=[],f=a("2e0e"),k={name:"Checklists",mixins:[f["a"]],props:{checklists:Array,paces:Array},data(){return{currentCL:0,checked:[]}}},L=k,y=a("2877"),_=Object(y["a"])(L,b,v,!1,null,null,null),w=_.exports,C={name:"LMovingMapToolboxControl",components:{LControl:g["a"],Checklists:w},props:{value:{type:Object,default:()=>({getLocation:!0,setView:!0,wakeLock:!0,inFlight:!1,allowWarning:!0,isChecklistsActive:!1})}},computed:{wakeLockable(){return"wakeLock"in navigator&&"visible"===document.visibilityState},aircraft(){return this.$store.state.currentAircraft},navigation(){return this.$store.state.currentNavigation}},watch:{value:{deep:!0,handler(t){this.$emit("input",t)}}},methods:{openModal(t,e){this.$buefy.modal.open({parent:this,component:this.$options.components[t],props:e,trapFocus:!0,"destroy-on-hide":!1})}}},x=C,$=Object(y["a"])(x,m,h,!1,null,null,null),M=$.exports,D=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("l-control",t._b({},"l-control",t.$attrs,!1),[a("b-field",{attrs:{grouped:"","group-multiline":""}},[a("div",{staticClass:"control"},[a("b-taglist",{attrs:{attached:""}},[a("b-tag",{attrs:{type:"is-primary",size:"is-medium"}},[t._v(t._s(t._f("precision")(t._f("to")(t.value.speed,"kt"),0)))]),a("b-tag",{attrs:{type:"is-light",size:"is-medium"}},[t._v("kt")])],1)],1),a("div",{staticClass:"control"},[a("b-taglist",{attrs:{attached:""}},[a("b-tag",{attrs:{type:"is-primary",size:"is-medium"}},[t._v(t._s(t._f("precision")(t._f("asHeading")(t.value.heading),0)))]),a("b-tag",{attrs:{type:"is-light",size:"is-medium"}},[t._v("°")])],1)],1),a("div",{staticClass:"control"},[a("b-taglist",{attrs:{attached:""}},[a("b-tag",{attrs:{type:"is-info",size:"is-medium"}},[t._v(t._s(t._f("precision")(t._f("to")(t.value.altitude,"ft"),-1)))]),a("b-tag",{attrs:{type:"is-light",size:"is-medium"}},[t._v("ft")])],1)],1),a("div",{staticClass:"control"},[a("b-taglist",{attrs:{attached:""}},[a("b-tag",{attrs:{type:"is-dark",size:"is-medium"}},[t._v(t._s(t._f("precision")(t._f("to")(t.value.vario,"ft/min"),-1)))]),a("b-tag",{attrs:{type:"is-light",size:"is-medium"}},[t._v("ft/min")])],1)],1)])],1)},S=[],E={name:"LMovingMapInstrumentsControl",components:{LControl:g["a"]},props:{value:{type:Object,default:()=>({speed:null,altitude:null,heading:null,vario:null})}},mixins:[f["a"]]},K=E,O=Object(y["a"])(K,D,S,!1,null,null,null),T=O.exports,z=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("l-control",t._b({},"l-control",t.$attrs,!1),[a("b-field",{attrs:{grouped:"","group-multiline":""}},[a("div",{staticClass:"control"},[a("b-taglist",{attrs:{attached:""}},[a("b-tag",{attrs:{type:"is-success",size:"is-medium"}},[t._v(t._s(t._f("precision")(t._f("to")(t.distance,"NM"),0)))]),a("b-tag",{attrs:{type:"is-light",size:"is-medium"}},[t._v("NM")])],1)],1),a("div",{staticClass:"control"},[a("b-taglist",{attrs:{attached:""}},[a("b-tag",{attrs:{type:"is-info",size:"is-medium"}},[t._v(t._s(t._f("precision")(t._f("asHeading")(t.heading),0)))]),a("b-tag",{attrs:{type:"is-light",size:"is-medium"}},[t._v("°")])],1)],1),a("div",{staticClass:"control"},[a("b-taglist",{attrs:{attached:""}},[a("b-tag",{attrs:{type:"is-light",size:"is-medium"}},[t._v("ETE")]),a("b-tag",{attrs:{type:"is-primary",size:"is-medium"}},[t._v(t._s(t._f("asDuration")(t.ETE)))])],1)],1)])],1)},N=[],V={name:"LMovingMapDestinationControl",components:{LControl:g["a"]},props:{from:Object,to:Object},mixins:[f["a"]],computed:{distance(){return this.from.distanceTo(this.to)},ETE(){return this.distance/this.from.speed},heading(){return this.from.bearingTo(this.to)},relative_bearing(){return this.heading-this.from.heading},vertical_speed(){return(this.to.altitude-this.from.altitude)/this.ETE}}},W=V,j=Object(y["a"])(W,z,N,!1,null,null,null),A=j.exports,F=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("l-layer-group",[t.value.latlng?a("l-marker",{attrs:{"lat-lng":t.value.latlng}},[a("l-icon",{attrs:{"class-name":"leaflet-diamond-icon"}},[a("div")])],1):t._e(),t.value.latlng&&t.value.accuracy?a("l-circle",{attrs:{"lat-lng":t.value.latlng,radius:t.value.accuracy,className:"accuracyCircle"}}):t._e(),this.value.latlng&&this.value.heading&&this.value.speed?a("l-polyline",{attrs:{"lat-lngs":t.speedVector,className:"speedVector"}}):t._e()],1)},P=[],q=a("1ebb"),B=a("4e2b"),G=a("fbba"),I=a("0dbd"),H={name:"LLocationMarker",components:{LLayerGroup:q["a"],LMarker:B["a"],LIcon:G["a"],LPolyline:s["a"],LCircle:I["a"]},props:{value:{type:Object,default:()=>({latlng:null,speed:null,heading:null,accuracy:null})},delay:{type:Number,default:()=>60}},computed:{speedVector(){return[this.value.latlng,this.destinationPoint(this.value.speed*this.delay,this.value.heading)]}}},J=H,R=(a("0223"),Object(y["a"])(J,F,P,!1,null,null,null)),U=R.exports,Q=function(){var t=this,e=t.$createElement,a=t._self._c||e;return t.origin&&t.value?a("span",[a("l-layer-group",[a("l-marker",{attrs:{"lat-lng":t.value.latlng},on:{contextmenu:function(e){return t.$emit("input")}}},[a("l-icon",{attrs:{"class-name":"leaflet-destination-icon"}},[a("div")])],1),a("l-polyline",{attrs:{"lat-lngs":t.destinationVector,className:"destinationVector"}})],1)],1):t._e()},X=[],Y=a("ef62"),Z={name:"LDestinationMarker",components:{LLayerGroup:q["a"],LMarker:B["a"],LIcon:G["a"],LPolyline:s["a"]},props:["value","origin"],mounted(){this.map=Object(Y["d"])(this.$parent,!0).mapObject},computed:{destinationVector(){return[this.origin.latlng,this.value.latlng]}}},tt=Z,et=(a("1849"),Object(y["a"])(tt,Q,X,!1,null,null,null)),at=et.exports,it=a("4b61"),nt={name:"MovingMap",components:{NavigationSelect:u["a"],AircraftSelect:p["a"],LMap:o["a"],LControlFullscreen:l["a"],LPolyline:s["a"],LBaseLayerGroup:d["a"],LMovingMapToolboxControl:M,LMovingMapInstrumentsControl:T,LMovingMapDestinationControl:A,LLocationMarker:U,LRouteLayerGroup:it["a"],LDestinationMarker:at},mixins:[c],data(){return{lastKnownLocation:void 0,lastKnownError:void 0,destination:void 0,wakeLock:null,traceDB:"navue_trace",traceType:"location",futurPositionDelay:180,minDestination:100,settings:{getLocation:!0,setView:!0,wakeLock:!0,inFlight:!1,allowWarning:!0}}},mounted(){this.requestWakeLock(),document.addEventListener("visibilitychange",this.requestWakeLock)},beforeDestroy(){this.stopLocate(),document.removeEventListener("visibilitychange",this.requestWakeLock),this.wakeLock&&this.wakeLock.release()},computed:{map(){return this.$refs.movingMap.mapObject},navigation(){return this.$store.state.currentNavigation||{routes:[]}},trace(){return(this.reportedLocations||[]).filter(t=>!!t.latlng).map(t=>t.latlng)}},watch:{"settings.setView":function(t){t&&this.lastKnownLocation&&this.bestView(this.lastKnownLocation)},"settings.wakeLock":function(t){t&&this.requestWakeLock(),!t&&this.wakeLock&&this.wakeLock.release()},"settings.getLocation":{handler(t){t?this.startLocate():this.stopLocate()}}},pouch:{reportedLocations(){return{database:this.traceDB,selector:{type:this.traceType}}}},methods:{setupMap(t){t.on("locationfound",this._locationFound,this).on("locationerror",this._locationError,this),this.settings.getLocation&&this.startLocate()},bestView(t){this.map.flyToBounds(t.toBounds(t.speed?t.speed*this.futurPositionDelay:t.accuracy),{padding:[100,100]})},addLocation(t){return this.$pouch[this.traceDB].post({...t,type:"location",_id:t.timestamp.toString()},{})},removeLocations(){this.$pouch[this.traceDB].destroy().then(()=>{let t=this.traceType;this.traceType=null,this.traceType=t}).catch(console.error)},setDestination(t){this.destination=new r["b"](t)},getDestination(t){this.destination&&t.distanceTo(this.destination)<this.minDestination&&(this.destination=this.navigation.getNextWaypoint(this.destination))},async requestWakeLock(){try{if(!("wakeLock"in navigator)||"visible"!==document.visibilityState)throw"wakelock unavaliable";this.wakeLock=await navigator.wakeLock.request("screen")}catch(t){this.settings.wakeLock=!1}},openWarning(t){this.$buefy.snackbar.open({message:t.message,position:"is-bottom",type:"is-danger",duration:5e3,actionText:"Deactivate",onAction:()=>{this.settings.allowWarning=!1,this.$buefy.toast.open({message:"Warnings Deactivated",queue:!1})}})}}},ot=nt,st=(a("30d1"),Object(y["a"])(ot,i,n,!1,null,null,null));e["default"]=st.exports},ae67:function(t,e,a){},b7de:function(t,e,a){}}]);