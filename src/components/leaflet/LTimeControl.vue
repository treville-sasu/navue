<template>
  <l-control v-bind="$attrs">
    <nav class="level is-mobile box">
      <div class="level-item has-text-centered">
        <div>
          <p class="heading">
            <b-icon
              :type="isEnroute ? 'is-danger' : 'is-primary'"
              :icon="isEnroute ? 'airplane-landing' : 'airplane-takeoff'"
            />
          </p>
          <p
            class="title is-clickable"
            @click="isEnroute ? null : startFlight()"
            @contextmenu.prevent.stop="isEnroute ? stopFlight() : null"
          >
            {{ fromStart | fromTimestamp | asDuration }}
          </p>
        </div>
      </div>
      <div class="level-item has-text-centered">
        <div>
          <p class="heading">
            <b-icon
              icon="timer-outline"
              :type="chronoTime ? 'is-danger' : 'is-primary'"
            />
          </p>
          <p
            class="title is-clickable"
            @click="startChrono"
            @contextmenu.prevent.stop="stopChrono"
          >
            {{ chrono | fromTimestamp | asDuration }}
          </p>
        </div>
      </div>
      <div class="level-item has-text-centered">
        <div>
          <p class="heading">
            <b-icon icon="alarm-plus" />
          </p>
          <div
            class="is-clickable timelist"
            @click.stop="addTime"
            @contextmenu.prevent.stop="removeTime"
          >
            <ul>
              <li v-for="time in markedTimes" :key="time">
                {{ time | fromTimestamp | asDuration }}
              </li>
            </ul>
            <span class="title"> - </span>
          </div>
        </div>
      </div>
    </nav>
  </l-control>
</template>

<style scoped>
.timelist {
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.2em;
  max-height: 2.4em;
}
</style>

<script>
import { LControl } from "vue2-leaflet";
import UnitSystem from "@/mixins/UnitSystem.js";

export default {
  name: "LTimeControl",
  components: {
    LControl
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
      this.markedTimes.unshift(Date.now());
    },
    removeTime() {
      this.markedTimes.shift();
    }
  }
};
</script>
