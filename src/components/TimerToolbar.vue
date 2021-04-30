<template>
  <nav v-if="flight" class="level is-mobile box">
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
          {{ flightDuration | asDuration }}
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
          {{ chrono | asDuration }}
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
            <li v-for="(time, index) in flight.markedTimes" :key="index">
              {{ time | asDuration }}
            </li>
          </ul>
          <span class="title"> - </span>
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
      return this.markedTimes.length;
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
      this.flight.markedTimes.unshift(new Date());
    },
    removeTime() {
      this.flight.markedTimes.shift();
    }
  }
};
</script>
