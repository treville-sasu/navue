<template>
  <nav v-if="flight" class="level is-mobile box">
    <div class="level-item has-text-centered">
      <div
        class="is-clickable"
        @click="isEnroute ? null : startFlight()"
        @contextmenu.prevent.stop="isEnroute ? stopFlight() : null"
      >
        <p class="heading">
          <b-icon
            :type="isEnroute ? 'is-danger' : 'is-primary'"
            :icon="isEnroute ? 'airplane-landing' : 'airplane-takeoff'"
          />
        </p>
        <p class="subtitle">
          {{ flightDuration | asDuration }}
        </p>
      </div>
    </div>
    <div class="level-item has-text-centered">
      <div
        class="is-clickable"
        @click="startChrono"
        @contextmenu.prevent.stop="stopChrono"
      >
        <p class="heading">
          <b-icon
            icon="timer-outline"
            :type="chronoTime ? 'is-danger' : 'is-primary'"
          />
        </p>
        <p class="subtitle ">
          {{ chrono | asDuration }}
        </p>
      </div>
    </div>
    <div class="level-item has-text-centered">
      <div
        class="is-clickable"
        @click.stop="addTime"
        @contextmenu.prevent.stop="removeTime"
      >
        <p class="heading">
          <b-icon icon="alarm-plus" />
        </p>
        <div class="timelist">
          <ul>
            <li v-for="(time, index) in flight.milestones" :key="index">
              {{ time | asDuration }}
            </li>
          </ul>
          <span class="subtitle"> - </span>
        </div>
      </div>
    </div>
  </nav>
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
import UnitSystem from "@/mixins/UnitSystem.js";

export default {
  name: "TimerToolbar",
  mixins: [UnitSystem],
  data() {
    return {
      currentTime: undefined,
      currentUpdater: undefined,
      chronoTime: undefined,
      finishedAt: null,
      startedAt: null
    };
  },
  mounted() {
    this.currentUpdater = setInterval(() => {
      this.currentTime = new Date();
    }, 1000);
  },
  destroyed() {
    clearInterval(this.currentUpdater);
  },
  computed: {
    isEnroute() {
      return !!this.startedAt && !this.finishedAt;
    },
    flightDuration() {
      if (this.finishedAt) return this.finishedAt - this.startedAt;
      return this.startedAt
        ? Math.max(0, this.currentTime - this.startedAt)
        : null;
    },
    chrono() {
      return this.chronoTime
        ? Math.max(0, this.currentTime - this.chronoTime)
        : null;
    },
    timesCount() {
      return this.milestones.length;
    },
    flight() {
      return this.$store.state.currentFlight;
    }
  },
  methods: {
    startFlight() {
      this.finishedAt = undefined;
      this.startedAt = new Date();
      this.$emit("update:settings", { inFlight: this.isEnroute });
    },
    stopFlight() {
      this.finishedAt = new Date();
      this.$emit("update:settings", { inFlight: this.isEnroute });
    },
    startChrono() {
      this.chronoTime = new Date();
    },
    stopChrono() {
      this.chronoTime = undefined;
    },
    addTime() {
      this.flight.milestones.unshift(new Date());
    },
    removeTime() {
      this.flight.milestones.shift();
    }
  }
};
</script>
