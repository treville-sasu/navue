<template>
  <section>
    <article class="message" v-for="(station, key) in messagesList" :key="key">
      <div class="message-header">
        <h4 class="title has-text-white">{{ station.oaci }}</h4>
        <span class="subtitle has-text-light">{{ station.nom }}</span>
      </div>
      <div class="message-body">
        <div v-for="(messages, type) in station" :key="type">
          <template v-if="Array.isArray(messages)">
            <pre
              v-for="(message, index) in messages"
              :key="station.name + type + index"
              >{{ message | trim }}</pre
            >
          </template>
        </div>
      </div>
    </article>
  </section>
</template>

<style scoped>
pre {
  margin: 0.5rem;
  padding: 0.5rem;
}
</style>

<script>
export default {
  name: "Opmet",
  props: {
    stations: Array
  },
  computed: {
    messagesList() {
      return this.groupeByCode(this.stations, "oaci");
    }
  },
  methods: {
    groupeByCode(xs, key) {
      return xs.reduce(function(rv, x) {
        // if (x) (rv[x[key]] = rv[x[key]] || []).push(x);
        if (x) rv[x[key]] = { ...rv[x[key]], ...x };
        return rv;
      }, {});
    }
  },
  filters: {
    trim: function(string) {
      return string.trim();
    }
  }
};
</script>
