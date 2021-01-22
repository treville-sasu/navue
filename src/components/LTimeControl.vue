<template>
  <l-control v-bind="$attrs">
    <nav class="level is-mobile box">
      <div class="level-item has-text-centered">
        <div>
          <p class="heading">From Start</p>
          <BIconButton
            v-on="
              isEnroute ? { contextmenu: stopFlight } : { click: startFlight }
            "
            :tooltip="{
              label: isEnroute ? 'Take off' : 'Landing'
            }"
            :icon="{
              type: isEnroute ? 'is-danger' : 'is-primary',
              icon: isEnroute ? 'airplane-landing' : 'airplane-takeoff'
            }"
          />
          <span
            v-on="
              isEnroute ? { contextmenu: stopFlight } : { click: startFlight }
            "
            class="title is-clickable"
          >
            {{ fromStart | fromTimestamp | asDuration }}
          </span>
        </div>
      </div>
      <div class="level-item has-text-centered">
        <div>
          <p class="heading">
            Chrono
          </p>
          <BIconButton
            v-if="!chronoTime"
            icon="timer-outline"
            tooltip="Start"
            @click="startChrono"
          >
          </BIconButton>
          <p
            class="title is-clickable"
            v-else
            @click="startChrono"
            @contextmenu="stopChrono"
          >
            {{ chrono | fromTimestamp | asDuration }}
          </p>
        </div>
      </div>
      <div class="level-item has-text-centered">
        <div>
          <p class="heading">
            Mark time
          </p>
          <BIconButton
            icon="alarm-plus"
            tooltip="Mark time"
            @click="addTime"
            @contextmenu="removeTime"
          >
          </BIconButton>
          <b-tag type="is-primary" rounded>{{ timesCount }}</b-tag>
        </div>
      </div>
    </nav>
  </l-control>
</template>

<script>
import { LControl } from "vue2-leaflet";
import BIconButton from "@/components/BIconButton.vue";
import UnitSystem from "@/mixins/UnitSystem.js";

export default {
  name: "LTimeControl",
  components: {
    LControl,
    BIconButton
  },
  mixins: [UnitSystem],
  data() {
    return {
      startTime: undefined,
      endTime: undefined,
      currentTime: undefined,
      currentUpdater: undefined,
      chronoTime: undefined,
      markedTimes: []
    };
  },
  mounted() {
    this.currentUpdater = setInterval(() => {
      this.currentTime = Date.now();
    }, 1000);
  },
  destroyed() {
    clearInterval(this.currentUpdater);
  },
  computed: {
    isEnroute() {
      return !!this.startTime && !this.endTime;
    },
    fromStart() {
      if (this.endTime) return this.endTime - this.startTime;
      return this.startTime
        ? Math.max(0, this.currentTime - this.startTime)
        : null;
    },
    chrono() {
      return this.chronoTime
        ? Math.max(0, this.currentTime - this.chronoTime)
        : null;
    },
    timesCount() {
      return this.markedTimes.length;
    }
  },
  methods: {
    startFlight() {
      this.endTime = undefined;
      this.startTime = Date.now();
      this.$emit("update:settings", { inFlight: this.isEnroute });
    },
    stopFlight() {
      this.endTime = Date.now();
      this.$emit("update:settings", { inFlight: this.isEnroute });
    },
    startChrono() {
      this.chronoTime = Date.now();
    },
    stopChrono() {
      this.chronoTime = undefined;
    },
    addTime() {
      this.markedTimes.push(Date.now());
    },
    removeTime() {
      this.markedTimes.pop();
    }
  }
};
</script>
