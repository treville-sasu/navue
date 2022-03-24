(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-2d221f18"],{cd01:function(e,t,a){"use strict";a.r(t);var render=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("section",[a("section",{staticClass:"section columns"},[a("div",{staticClass:"column is-one-fifth"},[a("AircraftManager",{attrs:{create:"",edit:"",inline:"",expanded:""},scopedSlots:e._u([{key:"default",fn:function(t){var n=t.selected;return[a("b-button",{attrs:{type:"is-primary","icon-right":"chevron-down"}},[e._v(" "+e._s(n?n.registration||"unsaved":"Select an aircraft")+" ")])]}}])})],1),a("div",{staticClass:"column"},[e.aircraft?a("b-tabs",{attrs:{position:"is-centered",multiline:"",expanded:""}},[a("b-tab-item",{attrs:{label:"Identification"}},[a("b-field",{attrs:{label:"Registration",horizontal:""}},[a("b-input",{attrs:{placeholder:"F-....",required:""},model:{value:e.aircraft.registration,callback:function(t){e.$set(e.aircraft,"registration",t)},expression:"aircraft.registration"}})],1),a("b-field",{attrs:{label:"Manufacturer",horizontal:""}},[a("b-input",{attrs:{placeholder:"Robin"},model:{value:e.aircraft.manufacturer,callback:function(t){e.$set(e.aircraft,"manufacturer",t)},expression:"aircraft.manufacturer"}})],1),a("b-field",{attrs:{label:"Model",horizontal:""}},[a("b-input",{attrs:{placeholder:"DR40"},model:{value:e.aircraft.model,callback:function(t){e.$set(e.aircraft,"model",t)},expression:"aircraft.model"}})],1),a("b-field",{attrs:{label:"Airworthiness Certificate",horizontal:""}},[a("b-input",{attrs:{maxlength:"200",type:"textarea",placeholder:"CNRA.. 30/04/1983"},model:{value:e.aircraft.cn,callback:function(t){e.$set(e.aircraft,"cn",t)},expression:"aircraft.cn"}})],1)],1),a("b-tab-item",{attrs:{label:"Paces"}},[a("AircraftDetailPaces",{attrs:{paces:e.aircraft.paces},on:{"update:paces":function(t){return e.$set(e.aircraft,"paces",t)}}})],1),a("b-tab-item",{attrs:{label:"Fuel"}},[a("AircraftDetailConsumptions",{attrs:{consumptions:e.aircraft.consumptions},on:{"update:consumptions":function(t){return e.$set(e.aircraft,"consumptions",t)}}})],1),a("b-tab-item",{attrs:{label:"Balance & Weight"}},[a("AircraftDetailBalance",{attrs:{balance:e.aircraft.balance},on:{"update:balance":function(t){return e.$set(e.aircraft,"balance",t)}}})],1),a("b-tab-item",{attrs:{label:"Envelopes"}},[a("AircraftDetailEnvelopes",{attrs:{envelopes:e.aircraft.envelopes},on:{"update:envelopes":function(t){return e.$set(e.aircraft,"envelopes",t)}}})],1),a("b-tab-item",{attrs:{label:"Checklists"}},[a("AircraftDetailChecklists",{attrs:{checklists:e.aircraft.checklists},on:{"update:checklists":function(t){return e.$set(e.aircraft,"checklists",t)}}})],1)],1):a("b-notification",{attrs:{"has-icon":"",icon:"airplane",closable:!1}},[a("h1",{staticClass:"title"},[e._v("Choose, edit & manage your aircrafts")]),a("h2",{staticClass:"subtitle"},[e._v(" aircrafts are stored in browser and synced online. ")])])],1)])])},n=[],l=a("7226"),AircraftDetailPacesvue_type_template_id_06743d87_scoped_true_render=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("section",[a("b-table",{attrs:{data:e.value.items},scopedSlots:e._u([{key:"empty",fn:function(){return[e._v(" Set cruise, climb, ... speeds to get ETA and ETE ")]},proxy:!0}])},[a("b-table-column",{attrs:{label:"Name"},scopedSlots:e._u([{key:"default",fn:function(t){return[a("b-input",{model:{value:t.row.name,callback:function(a){e.$set(t.row,"name",a)},expression:"props.row.name"}})]}}])}),a("b-table-column",{attrs:{label:"Speed"},scopedSlots:e._u([{key:"default",fn:function(t){return[a("b-field",[a("b-speed",{attrs:{controls:!1},model:{value:t.row,callback:function(a){e.$set(t,"row",a)},expression:"props.row"}})],1)]}}])}),a("b-table-column",{scopedSlots:e._u([{key:"default",fn:function(t){return[a("b-button",{attrs:{type:"is-secondary","icon-right":"close"},on:{click:function(a){return e.removeItem(t.row)}}})]}}])})],1),a("b-button",{attrs:{type:"is-primary"},on:{click:e.addItem}},[e._v("Add a pace")])],1)},r=[],o=a("3634"),s=a("7d8a"),i={name:"AircraftDetailPaces",components:{BSpeed:s["a"]},props:["paces"],data(){return{value:this.paces,checkedRows:[]}},methods:{addItem(){this.value.add(new o["g"](void 0,void 0,{name:void 0}))},removeItem(e){this.value.remove(e)}},watch:{value:{deep:!0,handler(e){this.$emit("update:paces",e)}}}},c=i,u=a("2877"),d=Object(u["a"])(c,AircraftDetailPacesvue_type_template_id_06743d87_scoped_true_render,r,!1,null,"06743d87",null),p=d.exports,AircraftDetailBalancevue_type_template_id_8b5605d4_render=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("section",[a("b-field",{attrs:{label:"Balanced on"}},[a("b-datepicker",{attrs:{placeholder:"Select last value sheet date","trap-focus":"",icon:"calendar-today"},model:{value:e.curatedDate,callback:function(t){e.curatedDate=t},expression:"curatedDate"}})],1),a("b-table",{attrs:{data:e.value.items},scopedSlots:e._u([{key:"empty",fn:function(){return[e._v(" Add weights values to allow Balance and MTOW calculation. ")]},proxy:!0}])},[a("b-table-column",{attrs:{label:"Name"},scopedSlots:e._u([{key:"default",fn:function(t){return[a("b-input",{model:{value:t.row.name,callback:function(a){e.$set(t.row,"name",a)},expression:"props.row.name"}})]}}])}),a("b-table-column",{attrs:{label:"Arm"},scopedSlots:e._u([{key:"default",fn:function(t){return[a("b-distance",{attrs:{controls:!1,step:.1},model:{value:t.row.lever,callback:function(a){e.$set(t.row,"lever",a)},expression:"props.row.lever"}})]}}])}),a("b-table-column",{attrs:{label:"Minimum"},scopedSlots:e._u([{key:"default",fn:function(t){return[a("b-numberinput",{attrs:{controls:!1,step:.1},model:{value:t.row.mass.min,callback:function(a){e.$set(t.row.mass,"min",a)},expression:"props.row.mass.min"}})]}}])}),a("b-table-column",{attrs:{label:"Maximum"},scopedSlots:e._u([{key:"default",fn:function(t){return[a("b-numberinput",{attrs:{controls:!1,step:.1},model:{value:t.row.mass.max,callback:function(a){e.$set(t.row.mass,"max",a)},expression:"props.row.mass.max"}})]}}])}),a("b-table-column",{attrs:{label:"Weight"},scopedSlots:e._u([{key:"default",fn:function(t){return[a("b-weight",{attrs:{controls:!1,step:.1},model:{value:t.row.mass,callback:function(a){e.$set(t.row,"mass",a)},expression:"props.row.mass"}})]}}])}),a("b-table-column",{scopedSlots:e._u([{key:"default",fn:function(t){return[a("b-checkbox-button",{attrs:{"native-value":!0,type:"is-primary"},model:{value:t.row.tank,callback:function(a){e.$set(t.row,"tank",a)},expression:"props.row.tank"}},[e._v("Tank")])]}}])}),a("b-table-column",{scopedSlots:e._u([{key:"default",fn:function(t){return[a("b-button",{attrs:{type:"is-secondary","icon-right":"close"},on:{click:function(a){return e.removeItem(t.row)}}})]}}])})],1),a("b-button",{attrs:{type:"is-primary"},on:{click:e.addItem}},[e._v("Add a weight")])],1)},b=[],m=a("0c9a"),BDistancevue_type_template_id_0c021a50_render=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("b-field",[a("b-numberinput",e._b({attrs:{editable:!e.$attrs.readonly,lazy:""},on:{input:function(t){return e.$emit()}},model:{value:e.local.value,callback:function(t){e.$set(e.local,"value",t)},expression:"local.value"}},"b-numberinput",e.$attrs,!1)),e.$attrs.readonly?a("b-input",e._b({attrs:{readonly:""},model:{value:e.local.unit,callback:function(t){e.$set(e.local,"unit",t)},expression:"local.unit"}},"b-input",e.$attrs,!1)):a("b-select",e._b({attrs:{required:""},model:{value:e.local.unit,callback:function(t){e.$set(e.local,"unit",t)},expression:"local.unit"}},"b-select",e.$attrs,!1),e._l(e.units,(function(t,n){return a("option",{key:n,domProps:{value:n}},[e._v(" "+e._s(n)+" ")])})),0)],1)},f=[],v={name:"BDistance",props:{value:{type:o["d"],default(){return new o["d"]}}},data(){return{local:this.value,units:o["d"].units}},watch:{local:{deep:!0,handler(e){this.$emit("input",e)}}}},h=v,k=Object(u["a"])(h,BDistancevue_type_template_id_0c021a50_render,f,!1,null,null,null),w=k.exports,BWeightvue_type_template_id_c967f3c6_render=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("b-field",[a("b-numberinput",e._b({attrs:{editable:!e.$attrs.readonly},model:{value:e.local.value,callback:function(t){e.$set(e.local,"value",t)},expression:"local.value"}},"b-numberinput",e.$attrs,!1)),e.$attrs.readonly?a("b-input",e._b({attrs:{readonly:""},model:{value:e.local.unit,callback:function(t){e.$set(e.local,"unit",t)},expression:"local.unit"}},"b-input",e.$attrs,!1)):a("b-select",e._b({attrs:{required:""},model:{value:e.local.unit,callback:function(t){e.$set(e.local,"unit",t)},expression:"local.unit"}},"b-select",e.$attrs,!1),e._l(e.units,(function(t,n){return a("option",{key:n,domProps:{value:n}},[e._v(" "+e._s(n)+" ")])})),0)],1)},y=[],_={name:"BWeight",props:{value:{type:o["i"],default(){return new o["i"]}}},data(){return{local:this.value,units:o["i"].units}},watch:{value:{deep:!0,handler(e){this.$emit("input",e)}}}},x=_,$=Object(u["a"])(x,BWeightvue_type_template_id_c967f3c6_render,y,!1,null,null,null),A=$.exports,g={name:"AircraftDetailBalance",components:{BDistance:w,BWeight:A},props:["balance"],data(){return{value:this.balance}},computed:{curatedDate:{get(){return this.value.date?new Date(this.value.date):this.value.date},set(e){this.value.date=e}}},methods:{addItem(){this.value.add(new m["a"](void 0,void 0,void 0,{name:void 0}))},removeItem(e){this.value.remove(e)}},watch:{value:{deep:!0,handler(e){this.$emit("update:paces",e)}}}},S=g,D=Object(u["a"])(S,AircraftDetailBalancevue_type_template_id_8b5605d4_render,b,!1,null,null,null),C=D.exports,AircraftDetailEnvelopesvue_type_template_id_62377647_render=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("section",[a("b-button",{attrs:{type:"is-primary"},on:{click:e.addEnvelope}},[e._v("Add an envelope")]),a("div",{staticClass:"columns"},[a("div",{staticClass:"column"},[a("b-tabs",{attrs:{vertical:""},model:{value:e.activeTab,callback:function(t){e.activeTab=t},expression:"activeTab"}},e._l(e.value,(function(t,n){return a("b-tab-item",{key:n,attrs:{value:""+n,label:t.name||""+(n+1)}},[a("b-field",{attrs:{label:"Name"}},[a("p",{staticClass:"control"},[a("b-button",{attrs:{"icon-right":"close"},on:{click:function(t){return e.removeEnvelope(n)}}})],1),a("b-input",{attrs:{required:""},model:{value:t.name,callback:function(a){e.$set(t,"name",a)},expression:"envelope.name"}})],1),a("b-table",{attrs:{data:t.items},scopedSlots:e._u([{key:"empty",fn:function(){return[e._v(" Add points with arm and mass to create an envelope. ")]},proxy:!0}],null,!0)},[a("b-table-column",{attrs:{label:"Mass"},scopedSlots:e._u([{key:"default",fn:function(t){return[a("b-weight",{attrs:{controls:!1,step:.1},model:{value:t.row.mass,callback:function(a){e.$set(t.row,"mass",a)},expression:"props.row.mass"}})]}}],null,!0)}),a("b-table-column",{attrs:{label:"Arm"},scopedSlots:e._u([{key:"default",fn:function(t){return[a("b-distance",{attrs:{controls:!1,step:.1},model:{value:t.row.lever,callback:function(a){e.$set(t.row,"lever",a)},expression:"props.row.lever"}})]}}],null,!0)}),a("b-table-column",{scopedSlots:e._u([{key:"default",fn:function(n){return[a("b-button",{attrs:{type:"is-secondary","icon-right":"close"},on:{click:function(a){return e.removeItem(t,n.row)}}})]}}],null,!0)})],1),a("b-button",{attrs:{type:"is-primary"},on:{click:function(a){return e.addItem(t)}}},[e._v("Add a point")])],1)})),1)],1),a("div",{staticClass:"column"},[e.value.length>0?a("BalanceChart",{attrs:{data:e.value,"chart-data":e.datasets}}):e._e()],1)])],1)},E=[],I=a("548d"),T=a("08df"),B=a("bd67"),M={name:"AircraftDetailEnvelopes",components:{BDistance:w,BWeight:A,BalanceChart:I["a"]},props:["envelopes"],mixins:[T["a"]],data(){return{value:this.envelopes,activeTab:void 0}},computed:{datasets(){return{datasets:[...this.value.items.map(e=>({...this.envelopesDataset,label:e.name,data:e.items.map(e=>({x:e.lever.value,y:e.mass.value}))}))]}}},methods:{addEnvelope(){this.activeTab=this.value.add(new B["b"]({name:void 0}))-1},removeEnvelope(e){this.value.remove(void 0,e),this.activeTab=e-1},addItem(e){e.add(new m["a"])},removeItem(e,t){e.remove(t)}},watch:{value:{deep:!0,handler(e){this.$emit("update:envelopes",e)}}}},O=M,j=Object(u["a"])(O,AircraftDetailEnvelopesvue_type_template_id_62377647_render,E,!1,null,null,null),P=j.exports,AircraftDetailConsumptionsvue_type_template_id_498beee2_render=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("section",[a("b-table",{attrs:{data:e.value.items},scopedSlots:e._u([{key:"empty",fn:function(){return[e._v(" Add fuel consumption values to allow fuel supply calculation. ")]},proxy:!0}])},[a("b-table-column",{attrs:{label:"Name"},scopedSlots:e._u([{key:"default",fn:function(t){return[a("b-input",{model:{value:t.row.name,callback:function(a){e.$set(t.row,"name",a)},expression:"props.row.name"}})]}}])}),a("b-table-column",{attrs:{label:"Value"},scopedSlots:e._u([{key:"default",fn:function(t){return[a("b-field",[a("b-numberinput",{attrs:{controls:!1},model:{value:t.row.value,callback:function(a){e.$set(t.row,"value",a)},expression:"props.row.value"}}),a("b-select",{attrs:{required:""},model:{value:t.row.unit,callback:function(a){e.$set(t.row,"unit",a)},expression:"props.row.unit"}},e._l(t.row.constructor.units,(function(t,n){return a("option",{key:n,domProps:{value:n}},[e._v(" "+e._s(n)+" ")])})),0),a("p",{staticClass:"control"},[a("span",{staticClass:"button is-static"},[e._v("/")])]),a("b-select",{attrs:{required:""},model:{value:t.row.reference,callback:function(a){e.$set(t.row,"reference",a)},expression:"props.row.reference"}},e._l(t.row.constructor.references,(function(t){return a("option",{key:t,domProps:{value:t}},[e._v(" "+e._s(t)+" ")])})),0)],1)]}}])}),a("b-table-column",{scopedSlots:e._u([{key:"default",fn:function(t){return[a("b-button",{attrs:{type:"is-secondary","icon-right":"close"},on:{click:function(a){return e.removeItem(t.row)}}})]}}])})],1),a("b-button",{attrs:{type:"is-primary"},on:{click:e.addItem}},[e._v("Add a consumption rate")])],1)},q=[],N={name:"AircraftDetailConsumptions",props:["consumptions"],data(){return{value:this.consumptions}},methods:{addItem(){this.value.add(new o["c"](void 0,void 0,void 0,{name:void 0}))},removeItem(e){this.value.remove(e)}},watch:{value:{deep:!0,handler(e){this.$emit("update:consumptions",e)}}}},W=N,z=Object(u["a"])(W,AircraftDetailConsumptionsvue_type_template_id_498beee2_render,q,!1,null,null,null),R=z.exports,AircraftDetailChecklistsvue_type_template_id_c51d7e4a_render=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("section",[a("b-button",{attrs:{type:"is-primary"},on:{click:e.addList}},[e._v("Add a list")]),a("b-tabs",{attrs:{vertical:""},model:{value:e.activeTab,callback:function(t){e.activeTab=t},expression:"activeTab"}},e._l(e.value,(function(t,n){return a("b-tab-item",{key:n,attrs:{value:""+n,label:t.name||""+(n+1)}},[a("b-field",{attrs:{label:"Name"}},[a("p",{staticClass:"control"},[a("b-button",{attrs:{"icon-right":"close"},on:{click:function(t){return e.removeList(n)}}})],1),a("b-input",{model:{value:t.name,callback:function(a){e.$set(t,"name",a)},expression:"checklist.name"}})],1),a("b-table",{attrs:{data:t.items},scopedSlots:e._u([{key:"empty",fn:function(){return[e._v(" Add Expectations, could be a verification or an action. ")]},proxy:!0}],null,!0)},[a("b-table-column",{attrs:{label:"Target"},scopedSlots:e._u([{key:"default",fn:function(t){return[a("b-input",{model:{value:t.row.name,callback:function(a){e.$set(t.row,"name",a)},expression:"props.row.name"}})]}}],null,!0)}),a("b-table-column",{attrs:{label:"Expectation"},scopedSlots:e._u([{key:"default",fn:function(t){return[a("b-input",{model:{value:t.row.expect,callback:function(a){e.$set(t.row,"expect",a)},expression:"props.row.expect"}})]}}],null,!0)}),a("b-table-column",{scopedSlots:e._u([{key:"default",fn:function(t){return[a("b-checkbox-button",{attrs:{"native-value":!0,type:"is-primary"},model:{value:t.row.action,callback:function(a){e.$set(t.row,"action",a)},expression:"props.row.action"}},[e._v("Action")])]}}],null,!0)}),a("b-table-column",{scopedSlots:e._u([{key:"default",fn:function(n){return[a("b-button",{attrs:{type:"is-secondary","icon-right":"close"},on:{click:function(a){return e.removeItem(t,n.row)}}})]}}],null,!0)})],1),a("b-button",{attrs:{type:"is-primary"},on:{click:function(a){return e.addItem(t)}}},[e._v("Add an expectation")])],1)})),1)],1)},L=[],F={name:"AircraftDetailChecklists",props:{checklists:{default(){return[]}}},data(){return{activeTab:void 0,value:this.checklists}},methods:{addList(){this.activeTab=this.value.add(new B["b"]({name:void 0}))},removeList(e){this.value.remove(void 0,e),this.activeTab=Math.max(e-1,0)},addItem(e){e.add({name:void 0,expect:void 0,action:!1})},removeItem(e,t){e.remove(t)}},watch:{value:{deep:!0,handler(e){this.$emit("update:checklists",e)}}}},J=F,V=Object(u["a"])(J,AircraftDetailChecklistsvue_type_template_id_c51d7e4a_render,L,!1,null,null,null),G=V.exports,H={name:"Aircraft",components:{AircraftDetailPaces:p,AircraftDetailBalance:C,AircraftDetailEnvelopes:P,AircraftDetailConsumptions:R,AircraftDetailChecklists:G,AircraftManager:l["a"]},computed:{aircraft(){return this.$store.state.currentAircraft}}},K=H,Q=Object(u["a"])(K,render,n,!1,null,null,null);t["default"]=Q.exports}}]);