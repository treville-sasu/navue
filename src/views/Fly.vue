<template>
  <section class="mpx-map-wrapper">
    <mx-map
      v-bind="mapSettings.base"
      @load="setupMap"
      @contextmenu="setDestination"
      @movestart="inhibitCamera"
    >
      <mx-i-control position="top-left">
        <b-field class="is-stackable">
          <DataToolbox
            v-if="!settings.inFlight"
            location
            navigation
            aircraft
            :flight="{ create: true, trace: traceDB }"
            :dropdown="{
              position: 'is-bottom-right',
              triggers: ['click', 'hover']
            }"
          />
          <p class="control">
            <ViewManager
              v-bind="settings"
              @update:settings="updateSettings"
              @update:camera="setCamera"
              @show:poi="showPoint"
            >
              <template #header="{ selected }">
                <b-input
                  v-model="selected.name"
                  placeholder="search location"
                />
              </template>
            </ViewManager>
          </p>
        </b-field>
      </mx-i-control>
      <mx-i-control position="bottom-left">
        <ReportToolbox
          :tooltip="{ position: 'is-top' }"
          class="is-stackable"
          navlog
          checklists
          vac
          weather
          aip
          notepad
        />
      </mx-i-control>
      <mx-scale-control unit="nautical" />
      <mx-i-control v-if="currentLocation" position="top-right">
        <InstrumentsDisplay class="is-stackable" :location="currentLocation" />
      </mx-i-control>
      <mx-i-control position="bottom-right">
        <TimerToolbox @update:settings="updateSettings" />
      </mx-i-control>
      <mx-layer v-bind="mapSettings.sia" />
      <mx-layer v-bind="mapSettings.swisstopo" />

      <mx-source type="geojson" id="vector" :data="flightVector">
        <mx-layer
          id="destination"
          v-bind="style.destination"
          @click="currentDestination = undefined"
        />
        <mx-layer id="bestPath" v-bind="style.path" />
        <mx-layer id="bestParameters" v-bind="style.parameters" />
      </mx-source>

      <mx-source
        v-if="flightCourse"
        id="course"
        type="geojson"
        :data="flightCourse"
      >
        <mx-layer id="location" v-bind="style.location.point" />
        <mx-layer id="nextMinutes" v-bind="style.location.futurs" />
        <mx-layer id="probablePath" v-bind="style.location.course" />
      </mx-source>
      >
        <mx-layer id="location" v-bind="style.location" />
        <mx-layer id="nextMinutes" v-bind="style.futurs" />
        <mx-layer id="probablePath" v-bind="style.course" />
      </mx-source>
    </mx-map>
  </section>
</template>

<script>
import MapX from "@/mixins/MapX";

import CameraHandler from "@/mixins/CameraHandler";
import LocationHandler from "@/mixins/LocationHandler";
import TraceHandler from "@/mixins/TraceHandler";
import DestinationHandler from "@/mixins/DestinationHandler";

import InstrumentsDisplay from "@/components/InstrumentsDisplay";

import TimerToolbox from "@/components/toolboxes/TimerToolbox";
import ReportToolbox from "@/components/toolboxes/ReportToolbox";
import DataToolbox from "@/components/toolboxes/DataToolbox";

import ViewManager from "@/components/managers/ViewManager";

import { WakeLock } from "@/mixins/apputils";

export default {
  name: "MovingMap",
  components: {
    InstrumentsDisplay,
    TimerToolbox,
    ReportToolbox,
    DataToolbox,
    ViewManager,
  },
  mixins: [
    MapX,
    WakeLock,
    CameraHandler,
    LocationHandler,
    TraceHandler,
    DestinationHandler,
  ],
  data() {
    return {
      legStart: undefined,
      map: undefined,
      settings: {
        getLocation: true,
        fullScreen: !!document.fullscreenElement,
        inFlight: false,
      },
      currentLocation: undefined,
    };
  },
  computed: {
    navigation() {
      return this.$store.state.currentNavigation;
    },
    flight: {
      get() {
        return this.$store.state.currentFlight;
      },
      set(data) {
        this.$store.commit("currentFlight", data);
      },
    },
  },
  watch: {
    "settings.viewMode"() {
      this.flightCourse &&
        this.setCamera(this.flightCourse, {
          trigger: "viewMode",
        });
    },
    "settings.fullScreen"(val) {
      this.toggleFullscreen(this.map.getContainer(), val);
    },
    "settings.getLocation"(val) {
      val ? this.startLocate() : this.stopLocate();
    },
    "settings.inFlight"(val) {
      if (val) {
        this.newLeg();
        this.addLocation(this.currentLocation);
      }
      this.settings.fullScreen = val;
    },
    navigation(nav) {
      nav &&
        this.setCamera({
          ...this.map.cameraForBounds(nav.bbox, {
            bearing: 0,
            pitch: 0
          })
        });
    },
    currentLocation(location) {
      if (location) {
        if (this.navigation) {
          let nextDestination = this.getDestination(location);
          if (nextDestination) this.setDestination(nextDestination);
        }
        if (this.settings.inFlight) this.addLocation(location);
      }
    },
    flightCourse(val) {
      val && this.setCamera(val, { trigger: "location" });
    },
  },
  methods: {
    newLeg() {
      this.flightTrace.geometry.coordinates.unshift([]);
      this.legStart = Date.now();
    },
    setupMap({ target }) {
      this.map = target;
      if (this.settings.getLocation) this.startLocate();
    },
    showPoint(point) {
      point && this.setCamera({ features: [point] });
    },
    addLocation(payload) {
      let asJSON = JSON.parse(JSON.stringify(payload));
      asJSON._id = `${this.legStart}-${payload.properties.timestamp}`;
      return this.$pouch[this.traceDB].put(asJSON);
    },
    updateSettings(opts) {
      this.settings = { ...this.settings, ...opts };
    },
    toggleFullscreen(element, force) {
      if (force == undefined)
        if (!document.fullscreenElement) element.requestFullscreen();
        else document.exitFullscreen();
      else if (force) element.requestFullscreen();
      else document.exitFullscreen();
    },
  },
};
</script>
