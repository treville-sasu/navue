(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-6888504e"],{"29d1":function(t,e,a){"use strict";a.r(e);var render=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("section",{staticClass:"section"},[a("nav",{staticClass:"level"},[a("div",{staticClass:"level-item has-text-centered"},[a("div",[a("p",{staticClass:"heading"},[t._v("Navigation")]),t.navigation?a("p",{staticClass:"title"},[t._v(t._s(t.navigation.name))]):a("NavigationManager",{attrs:{select:""}})],1)]),a("div",{staticClass:"level-item has-text-centered"},[a("div",[a("p",{staticClass:"heading"},[t._v("Aircraft")]),t.aircraft?a("p",{staticClass:"title"},[t._v(t._s(t.aircraft.registration))]):a("AircraftManager",{attrs:{select:""}})],1)]),a("div",{staticClass:"level-item has-text-centered"},[a("div",[a("p",{staticClass:"heading"},[t._v("Pace")]),t.aircraft?a("b-select",{attrs:{placeholder:"Select a pace"},model:{value:t.pace,callback:function(e){t.pace=e},expression:"pace"}},t._l(t.aircraft.paces,(function(e){return a("option",{key:e.name,domProps:{value:e}},[t._v(" "+t._s(e.name)+" ("+t._s(e)+") ")])})),0):a("p",{staticClass:"title"},[t._v("<<<")])],1)])]),t.navigation&&t.aircraft?a("div",[a("b-tabs",{staticClass:"box",attrs:{multiline:""},model:{value:t.currentRoute,callback:function(e){t.currentRoute=e},expression:"currentRoute"}},[t._l(t.navigation.routes,(function(e,s){return a("b-tab-item",{key:s,attrs:{label:""+(s+1),icon:"chevron-triple-right"}},[a("table",{staticClass:"table is-narrow is-hoverable is-fullwidth"},[a("thead",[a("colgroup",[a("col",{attrs:{span:"3"}}),a("col",{attrs:{span:"3"}})]),a("tr",[a("th",[t._v("Waypoint")]),a("th",[t._v("Alt.")]),a("th",[t._v("Notes")]),a("th",[t._v("Bearing")]),a("th",[t._v("Distance")]),a("th",[t._v("ETE")])])]),a("tfoot",[a("tr",[a("th"),a("th",[t._v("min Alt.")]),a("th"),a("th"),a("th",{staticClass:"has-text-right"},[t._v(" "+t._s(t._f("as")(t.routeDistance(e),"NM",3))+" ")]),a("th",{staticClass:"has-text-right"},[t._v(" "+t._s(t._f("asDuration")(t.routeETE(e)))+" ")])])]),a("tbody",[t._l(e,(function(s,i){return[a("tr",{key:"wp_"+i},[a("td",{attrs:{rowspan:"2"}},[a("span",{staticClass:"button is-static"},[t._v(" "+t._s(i))]),t._v(" "+t._s(s.name)+" ")]),a("td",{staticClass:"has-text-right",attrs:{rowspan:"2"}},[t._v(" "+t._s(s.altitude)+" ")]),a("td",{attrs:{rowspan:"2"}},[t._v(" "+t._s(s.notes)+" ")]),0==i?a("td",{attrs:{colspan:"3",height:"1em"}}):t._e()]),i+1<e.length?a("tr",{key:"leg_"+i},[a("td",{staticClass:"has-text-right",attrs:{rowspan:"2"}},[t._v(" "+t._s(t.legBearing(e,i))+" ")]),a("td",{staticClass:"has-text-right",attrs:{rowspan:"2"}},[t._v(" "+t._s(t._f("as")(t.legDistance(e,i),"NM",3))+" ")]),a("td",{staticClass:"has-text-right",attrs:{rowspan:"2"}},[t._v(" "+t._s(t._f("asDuration")(t.legETE(e,i)))+" ")])]):a("tr",{key:"fill_"+i},[a("td",{attrs:{colspan:"2",height:"1em"}})])]}))],2)])])})),a("b-tab-item",{attrs:{label:"Summary",icon:"file-replace-outline"}},[a("nav",{staticClass:"level"},[a("div",{staticClass:"level-item has-text-centered"},[a("div",[a("p",{staticClass:"heading"},[t._v(" Total Distance ")]),a("p",{staticClass:"title"},[t._v(" "+t._s(t._f("as")(t.navigationDistance(t.navigation),"NM",2))+" ")])])]),a("div",{staticClass:"level-item has-text-centered"},[a("div",[a("p",{staticClass:"heading"},[t._v(" Total Time ")]),a("p",{staticClass:"title"},[t._v(" "+t._s(t._f("asDuration")(t.navigationDistance(t.navigation)))+" ")])])]),a("div",{staticClass:"level-item has-text-centered"},[a("div",[a("p",{staticClass:"heading"},[t._v(" Fuel Burned ")]),a("p",{staticClass:"title"},[t._v(" - L ")])])])])])],2)],1):t._e()])},s=[],i=a("f2f1"),n=a("9283"),l=a("3634"),r=a("2e0e"),c={name:"NavLog",components:{NavigationManager:i["a"],AircraftManager:n["a"]},mixins:[r["a"]],data(){return{currentRoute:void 0,pace:void 0}},computed:{navigation(){return this.$store.state.currentNavigation},aircraft(){return this.$store.state.currentAircraft}},methods:{navigationDistance(t){return new l["d"](t.routes.items.reduce((t,e)=>t+this.routeDistance(e),0))},navigationETE(t){return this.navigationDistance(t)*this.pace},routeDistance(t){let e=0;return t.items.reduce((t,a)=>(t&&(e+=t.distanceTo(a)),a),null),new l["d"](e)},routeETE(t){return this.routeDistance(t)*this.pace},waypointPair(t,e){if(!(e+1>=t.length))return[t.items[e],t.items[e+1]]},legDistance(t,e){const[a,s]=this.waypointPair(t,e);return a.distanceTo(s)},legBearing(t,e){const[a,s]=this.waypointPair(t,e);return a.bearingTo(s)},legETE(t,e){return this.legDistance(t,e)*this.pace}}},o=c,u=a("2877"),d=Object(u["a"])(o,render,s,!1,null,null,null);e["default"]=d.exports},"2e0e":function(t,e,a){"use strict";e["a"]={filters:{as(t,e,a){if(t)return t.as(e,a)},asDuration(t){return t?new Date(t).toLocaleTimeString(void 0,{timeZone:"UTC",hour12:!1,hour:"2-digit",minute:"2-digit",second:"2-digit"}):"-"}}}},f2f1:function(t,e,a){"use strict";var render=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"columns is-multiline is-centered"},[a("div",{staticClass:"column"},[a("div",{staticClass:"box"},[t.selectedData?a("b-field",{attrs:{label:"Current Navigation"}},[a("b-input",{attrs:{value:t.selectedData.name,disabled:""}})],1):a("b-field",{attrs:{label:"Choose a navigation"}},[a("b-autocomplete",{attrs:{placeholder:"LFxx > LFxx...",data:t.availableData||[],icon:"magnify",field:"name","open-on-focus":"","keep-first":"","clear-on-select":"",clearable:""},on:{select:t.useData},model:{value:t.search,callback:function(e){t.search=e},expression:"search"}},[t.create?a("template",{slot:"header"},[a("a",{on:{click:function(e){return t.useData(t.newNavigation)}}},[a("span",[t._v(" Create a new one... ")])])]):t._e(),a("template",{slot:"empty"},[t._v(" No results for "+t._s(t.search))])],2)],1),t.selectedData?a("b-button",{attrs:{"icon-left":"selection-off",type:"is-primary",expanded:"",label:"Discard"},on:{click:function(e){return t.useData(null)}}}):t._e()],1)]),t.create?a("div",{staticClass:"column"},[a("div",{staticClass:"box"},[t.selectedData?t._e():a("b-field",{staticClass:"file"},[a("b-upload",{attrs:{accept:"application/json","drag-drop":"",expanded:""},on:{input:t.importData},model:{value:t.upload,callback:function(e){t.upload=e},expression:"upload"}},[a("div",{staticClass:"content has-text-centered"},[a("p",[a("b-icon",{attrs:{icon:"upload",size:"is-large"}})],1),a("p",[t._v("Upload Navigation data")])])])],1),t.selectedData?a("b-button",{attrs:{"icon-left":"plus-circle-multiple-outline",type:"is-primary",expanded:"",label:"Clone Navigation"},on:{click:function(e){t.useData(t.cloneData(t.selectedData))}}}):t._e()],1)]):t._e(),t.selectedData&&t.save?a("div",{staticClass:"column"},[a("div",{staticClass:"box buttons"},[a("b-button",{attrs:{"icon-left":"download-outline",type:"is-primary",expanded:"",label:"Download"},on:{click:t.exportData}}),a("b-field",[a("b-input",{attrs:{placeholder:"Navigation name",lazy:!0,type:"is-warning",required:"",expanded:""},model:{value:t.selectedData.name,callback:function(e){t.$set(t.selectedData,"name",e)},expression:"selectedData.name"}}),a("p",{staticClass:"control"},[a("b-button",{attrs:{"icon-left":"cloud-upload-outline",type:t.selectedData&&t.selectedData._id?"is-primary":"is-warning",label:"Save"},on:{click:function(e){return t.saveData(t.selectedData)}}})],1)],1),t.fromDB?a("b-button",{attrs:{"icon-left":"delete-outline",type:"is-danger",expanded:"",label:"Delete"},on:{click:t.deleteData}}):t._e()],1)]):t._e()])},s=[],i=a("1db5"),n=a("1caf"),l={name:"NavigationManager",mixins:[i["a"]],props:{select:Boolean,create:Boolean,save:Boolean},data(){return{dataType:"Navigation"}},pouch:{availableData(){return{database:"navue",selector:{type:this.dataType,name:{$regex:RegExp(this.search,"i")}}}}},computed:{selectedData:{get(){return this.$store.state.currentNavigation},set(t){this.$store.commit("currentNavigation",t)}},newNavigation(){return new n["a"]}}},r=l,c=a("2877"),o=Object(c["a"])(r,render,s,!1,null,null,null);e["a"]=o.exports}}]);