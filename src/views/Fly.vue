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
          <p v-if="!settings.inFlight" class="control">
            <NavigationManager append-to-body>
              <template #header="{ selected }">
                <span>
                  {{ selected.name }}
                </span>
              </template>
            </NavigationManager>
          </p>
          <p v-if="!settings.inFlight" class="control">
            <FlightManager append-to-body persistent edit :trace="traceDB" />
          </p>
          <p class="control">
            <ViewManager
              :mode="settings.followMode"
              follow
              append-to-body
              @update:settings="updateSettings"
              @update:camera="setCamera"
              @show:poi="showPoint"
            />
          </p>
        </b-field>
      </mx-i-control>
      <mx-scale-control position="bottom-left" unit="nautical" />
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
      <mx-i-control v-if="currentLocation" position="top-right">
        <InstrumentsDisplay class="is-stackable" :location="currentLocation" />
      </mx-i-control>
      <mx-i-control position="bottom-right">
        <TimerToolbox @update:settings="updateSettings" />
      </mx-i-control>
      <mx-layer v-bind="mapSettings.sia" />
      <mx-layer v-bind="mapSettings.swisstopo" />

      <mx-source id="vector" type="geojson" :data="flightVector">
        <mx-layer
          id="destination"
          v-bind="style.destination.point"
          @contextmenu="currentDestination = undefined"
        />
        <mx-layer id="destPath" v-bind="style.destination.path" />
        <mx-layer id="destParameters" v-bind="style.destination.parameters" />
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

      <mx-source
        v-if="navigationCourse"
        id="navigation"
        type="geojson"
        :data="navigationCourse"
      >
        <mx-layer id="navPath" v-bind="style.navigation.path" />
        <mx-layer id="navParameters" v-bind="style.navigation.parameters" />
        <mx-layer
          id="navPoints"
          v-bind="style.navigation.point"
          @click="setDestination"
          @contextmenu="currentDestination = undefined"
        />
      </mx-source>
      <mx-source
        v-if="flightTrace"
        id="trace"
        type="geojson"
        :data="flightTrace"
      >
        <mx-layer id="flightPath" v-bind="style.trace.path" />
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
import NavigationHandler from "@/mixins/NavigationHandler";

import InstrumentsDisplay from "@/components/InstrumentsDisplay";

import TimerToolbox from "@/components/toolboxes/TimerToolbox";
import ReportToolbox from "@/components/toolboxes/ReportToolbox";

import NavigationManager from "@/components/managers/NavigationManager";
import FlightManager from "@/components/managers/FlightManager";
import ViewManager from "@/components/managers/ViewManager";

import { WakeLock } from "@/mixins/apputils";

export default {
  name: "MovingMap",
  components: {
    InstrumentsDisplay,
    TimerToolbox,
    ReportToolbox,
    NavigationManager,
    FlightManager,
    ViewManager,
  },
  mixins: [
    MapX,
    WakeLock,
    CameraHandler,
    LocationHandler,
    TraceHandler,
    DestinationHandler,
    NavigationHandler,
  ],
  data() {
    return {
      legStart: undefined,
      map: undefined,
      settings: {
        followMode: "north",
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
    "settings.followMode"(val, old) {
      if (val) {
        if (!old) this.startLocate();
        this.flightCourse &&
          this.setCamera(this.flightCourse, {
            followMode: val,
          });
      } else this.stopLocate();
    },
    "settings.fullScreen"(val) {
      this.toggleFullscreen(this.map.getContainer(), val);
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
        this.setCamera(
          {
            ...this.map.cameraForBounds(nav.bbox, {
              bearing: 0,
              pitch: 0,
            }),
          },
          { followMode: "location" }
        );
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
      val && this.setCamera(val, { followMode: this.settings.followMode });
    },
  },
  methods: {
    setupMap({ target }) {
      this.map = target;
      if (this.settings.followMode) this.startLocate();
    },
    newLeg() {
      this.flightTrace.geometry.coordinates.unshift([]);
      this.legStart = Date.now();
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
