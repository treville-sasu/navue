<template>
  <b-collapse class="card" animation="fade">
    <div
      slot="trigger"
      slot-scope="props"
      class="card-header"
      role="button"
      aria-controls="contentIdForA11y3"
    >
      <p class="card-header-title">
        {{ name }}
      </p>
      <a class="card-header-icon">
        <b-icon :icon="props.open ? 'menu-down' : 'menu-up'"> </b-icon>
      </a>
    </div>
    <div class="card-content">
      <b-table
        :data="routesSummaries"
        draggable
        narrowed
        striped
        :selected.sync="selectedSummaries"
      >
        <!-- @dragstart="dragstart" @drop="drop" @dragover="dragover"
        @dragleave="dragleave" -->
        <b-table-column field="id" label="Dist." v-slot="props">
          {{ props.row.distance | asDistance("NM") | precision(0) }}
          NM
        </b-table-column>
        <b-table-column field="id" label="ETE" v-slot="props">
          {{ props.row.duration | asDuration }}
        </b-table-column>
        <template v-slot:empty>
          <div class="content has-text-grey has-text-centered">
            <p>No route yet</p>
          </div>
        </template>
      </b-table>
    </div>
    <footer class="card-footer">
      <span class="card-footer-item"
        >{{ totalDistance | asDistance("NM") | precision(0) }} NM</span
      >
      <span class="card-footer-item">{{ totalDuration | asDuration }} </span>
    </footer>
  </b-collapse>
</template>

<script>
import { UnitSystem } from "@/mixins/apputils";

export default {
  name: "NavigationSummary",
  mixins: [UnitSystem],
  props: {
    name: {
      type: String,
      default() {
        return "unnamed";
      },
    },
    routes: Array,
    selected: Number,
    speed: Number,
  },
  computed: {
    routesSummaries() {
      return this.routes.map((rte, id) => {
        return {
          id: id,
          distance: this.routeTotalDistance(rte),
          duration: this.routeTotalDistance(rte) / this.speed,
        };
      });
    },
    selectedSummaries: {
      get() {
        return this.routesSummaries[this.selected];
      },
      set(selected) {
        this.$emit("select", selected.id);
      },
    },
    totalDuration() {
      return this.routesSummaries.reduce(
        (total, current) => (total += current.duration),
        0
      );
    },
    totalDistance() {
      return this.routesSummaries.reduce(
        (total, current) => (total += current.distance),
        0
      );
    },
  },
  methods: {
    routeTotalDistance(waypoints) {
      let total = 0;
      waypoints.reduce((previous, current) => {
        if (previous) {
          total += previous.latlng.distanceTo(current.latlng);
        }
        return current;
      }, null);
      return total;
    },
  },
};
</script>
