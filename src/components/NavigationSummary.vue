<template>
  <b-dropdown hoverable aria-role="list" position="is-bottom-left">
    <b-button
      slot="trigger"
      tag="a"
      icon-left="clipboard-list-outline"
      class="leaflet-bar"
    />
    <b-table
      :data="routesSummaries"
      narrowed
      striped
      :selected.sync="selectedSummaries"
    >
      <b-table-column field="distance" label="Dist." numeric v-slot="props">
        {{ props.row.distance | to("NM") | precision(0) }}
        NM
      </b-table-column>
      <b-table-column field="duration" label="ETE" numeric v-slot="props">
        {{ props.row.duration | asDuration }}
      </b-table-column>
      <template v-slot:empty>
        <div class="content has-text-grey has-text-centered">
          <p>No route yet</p>
        </div>
      </template>
      <template slot="footer">
        <th>
          <div class="th-wrap is-numeric">
            {{ totalDistance | to("NM") | precision(0) }} NM
          </div>
        </th>
        <th>
          <div class="th-wrap is-numeric">{{ totalDuration | asDuration }}</div>
        </th>
      </template>
    </b-table>
  </b-dropdown>
</template>

<script>
import UnitSystem from "@/mixins/UnitSystem";
import LatLon from "geodesy/latlon-spherical.js";

export default {
  name: "NavigationSummary",
  mixins: [UnitSystem],
  props: {
    routes: Array,
    selected: Number,
    speed: Number
  },
  computed: {
    routesSummaries() {
      return this.routes.map((rte, id) => {
        return {
          id: id,
          distance: this.routeTotalDistance(rte),
          duration: this.routeTotalDistance(rte) / this.speed
        };
      });
    },
    selectedSummaries: {
      get() {
        return this.routesSummaries[this.selected];
      },
      set(selected) {
        this.$emit("select", selected.id);
      }
    },
    totalDuration() {
      return this.routesSummaries.reduce(
        (ttl, crt) => (ttl += crt.duration),
        0
      );
    },
    totalDistance() {
      return this.routesSummaries.reduce(
        (ttl, crt) => (ttl += crt.distance),
        0
      );
    }
  },
  methods: {
    routeTotalDistance(waypoints) {
      let total = 0;
      waypoints.reduce((previous, current) => {
        if (previous) {
          total += new LatLon(
            previous.latlng.lat,
            previous.latlng.lng
          ).rhumbDistanceTo(new LatLon(current.latlng.lat, current.latlng.lng));
        }
        return current;
      }, null);
      return total;
    }
  }
};
</script>
