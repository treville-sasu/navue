<template>
  <section>
    <section class="hero is-primary is-hidden-mobile">
      <div class="hero-body">
        <div class="container">
          <h1 class="title">Approach Charts</h1>
          <h2 class="subtitle">
            Get charts for VFR and IFR arrival on your airfields. Keep them up
            to date
          </h2>
        </div>
      </div>
    </section>
    <div class="notification">
      <b-field label="ICAO Code for Airports" expanded>
        <b-taginput
          v-model="codes"
          autocomplete
          :data="filteredTags"
          @typing="getFilteredCodes"
          icon="label"
          placeholder="LFxx, ..., tar..."
          maxtags="50"
          maxlength="4"
          field="id"
        >
          <template slot-scope="props">
            <strong>{{ props.option.id }}</strong
            >: <i>{{ props.option.name }}</i>
          </template>
          <template slot="empty">
            Code not found.
          </template>
        </b-taginput>
      </b-field>
    </div>

    <section class="section">
      <h2 class="subtitle">Work in progress.</h2>
      <ChartViewer
        v-for="(airfield, key) in codes"
        :value="airfield"
        :key="key"
      />
    </section>
  </section>
</template>

<script>
const data = require("@/store/vac.json");

import ChartViewer from "@/components/ChartViewer.vue";
export default {
  components: {
    ChartViewer,
  },
  data() {
    return {
      codes: [],
      filteredTags: data,
    };
  },
  methods: {
    getFilteredCodes(text) {
      this.filteredTags = data.filter((option) => {
        return (
          option.name
            .toString()
            .toLowerCase()
            .indexOf(text.toLowerCase()) >= 0 ||
          option.id
            .toString()
            .toLowerCase()
            .indexOf(text.toLowerCase()) >= 0
        );
      });
    },
  },
};
</script>
