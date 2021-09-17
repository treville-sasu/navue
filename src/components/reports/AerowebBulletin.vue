<template>
  <section>
    <b-field label="Weather Stations" expanded class="is-hidden-printer">
      <b-icao
        v-model="query.codes"
        :presets="poi"
        @typing="resetTimer"
        maxtags="12"
        allow-new
        expanded
      />
    </b-field>
    <b-collapse :open="false" position="is-bottom" class="is-hidden-printer">
      <template #trigger="props">
        <b-icon :icon="!props.open ? 'menu-down' : 'menu-up'"></b-icon>
        {{ !props.open ? "All options" : "Fewer options" }}
      </template>
      <b-field label="Message type">
        <b-checkbox-button
          v-model="query.categories"
          v-for="category in avaliableCategories"
          :key="category"
          :native-value="category"
        >
          {{ category }}
        </b-checkbox-button>
      </b-field>
    </b-collapse>

    <div class="placeholder" v-if="!results.length">
      Search for METAR & TAF.
      <b-loading :is-full-page="false" :active="isLoading" />
    </div>
    <b-message
      v-else
      v-for="station in results"
      :key="station.oaci"
      :closable="false"
    >
      <template #header> {{ station.oaci }} - {{ station.nom }} </template>
      <pre
        class="message"
        v-for="(message, key2) in station.messages"
        :key="`${station.oaci}_${key2}`"
        >{{ message }}</pre
      >
      <pre class="opmet" v-if="!station.messages.length">nil</pre>
    </b-message>
  </section>
</template>
<style>
pre.message {
  margin: 0.5rem;
  padding: 0.5rem;
  white-space: pre-line;
}
</style>
<script>
import BIcao from "@/components/buefy/BIcao.vue";

import Aeroweb from "@/mixins/Aeroweb";
import CachableSearch from "@/mixins/CachableSearch";

export default {
  name: "AerowebBulletin",
  components: {
    BIcao
  },
  mixins: [Aeroweb, CachableSearch],
  data() {
    return {
      type: "metar",
      query: {
        codes: [],
        categories: ["OPMET"]
      }
    };
  },

  methods: {
    async search() {
      return (await this.getMessages(this.query)).flat();
    }
  }
};
</script>
