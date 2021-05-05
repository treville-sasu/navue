<template>
  <b-progress
    v-if="running || indeterminate"
    :value="indeterminate ? undefined : value"
    :max="duration"
    v-bind="$attrs"
  >
    <slot />
  </b-progress>
</template>

<script>
export default {
  name: "BTimer",
  props: {
    duration: Number,
    precision: {
      type: Number,
      default: 10
    },
    countdown: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      elapsed: 0,
      timer: undefined,
      indeterminate: false
    };
  },
  computed: {
    running() {
      return !!this.timer;
    },
    value() {
      return this.countdown ? this.duration - this.elapsed : this.elapsed;
    }
  },
  methods: {
    start() {
      if (!this.timer) {
        this.timer = setInterval(this.countup, this.precision, this.precision);
        this.$emit("start", this.elapsed, this.duration);
      }
    },
    stop() {
      clearInterval(this.timer);
      this.timer = undefined;
      this.$emit("stop", this.elapsed, this.duration);
    },
    reset() {
      this.stop();
      this.flyback();
    },
    flyback() {
      this.$emit("reset", this.elapsed, this.duration);
      this.elapsed = 0;
    },
    async hold(func) {
      this.indeterminate = true;
      await func.apply();
      this.indeterminate = false;
    },
    countup(i) {
      if (this.elapsed >= this.duration) {
        this.stop();
        this.$emit("timesup", this.elapsed, this.duration);
      } else this.elapsed += i;
    }
  }
};
</script>
