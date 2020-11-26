<template>
  <b-collapse v-if="haveMessages" class="message is-primary" animation="slide">
    <div class="message-header" slot="trigger">
      <h4 class="title has-text-white mb-0">{{ station.oaci }}</h4>
      <span class="subtitle has-text-light">{{ station.nom }}</span>
    </div>
    <div>
      <div class="message-content">
        <pre
          v-for="(message, index) in station.messages"
          :key="station.name + type + index"
          >{{ message | trim }}</pre
        >
      </div>
    </div>
  </b-collapse>
  <!-- <b-tag v-else type="is-warning" size="is-medium">
    {{ station.oaci }}
  </b-tag> -->
</template>

<style scoped>
.mb-0 {
  margin-bottom: 0 !important;
}
pre {
  margin: 0.5rem;
  padding: 0.5rem;
  white-space: pre-line;
}
</style>

<script>
export default {
  name: "WeatherMessage",
  props: {
    station: Object,
    type: String
  },
  computed: {
    haveMessages() {
      return this.station.messages.length > 0;
    }
  },
  filters: {
    trim: str => str.trim()
  }
};
</script>
