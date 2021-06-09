<template>
  <section class="box">
    <b-tabs v-model="selectedRoute" class="box" multiline>
      <b-tab-item label="Summary" icon="file-replace-outline">
        <nav class="level">
          <div class="level-item has-text-centered">
            <div>
              <p class="heading">
                Total Distance
              </p>
              <p class="title">
                {{ navigationDistance(navigation) | as("NM", 2) }}
              </p>
            </div>
          </div>
          <div class="level-item has-text-centered">
            <div>
              <p class="heading">
                Routes
              </p>
              <p class="title">
                {{ navigation.routes.length }}
              </p>
            </div>
          </div>
          <div class="level-item has-text-centered">
            <div>
              <p class="heading">
                Waypoints
              </p>
              <p class="title">
                {{ navigation.waypoints.length }}
              </p>
            </div>
          </div>
        </nav>
        <b-field label="Notes" label-position="on-border">
          <b-notepad v-model="navigation.notes" />
        </b-field>
      </b-tab-item>
      <b-tab-item
        v-for="(route, index) in navigation.routes"
        :key="index"
        :label="`${index + 1}`"
        icon="chevron-triple-right"
      >
        <waypoint-content
          :value="wp"
          :key="index"
          v-for="(wp, index) in route"
        />
      </b-tab-item>
    </b-tabs>
  </section>
</template>

<script>
import { Distance } from "@/models/Quantities";

import UnitSystem from "@/mixins/UnitSystem";
import BNotepad from "@/components/buefy/BNotepad.vue";
import WaypointContent from "@/components/WaypointContent.vue";

export default {
  name: "NavigationDetails",
  mixins: [UnitSystem],
  components: { BNotepad, WaypointContent },
  data() {
    return {
      selectedRoute: undefined
    };
  },
  computed: {
    navigation() {
      return this.$store.state.currentNavigation;
    },
    aircraftPaces() {
      return (
        this.$store.state.currentAircraft &&
        this.$store.state.currentAircraft.paces
      );
    },
    currentSpeed() {
      return (
        this.$store.state.currentLocation &&
        this.$store.state.currentLocation.speed &&
        this.$store.state.currentLocation.speed.as("kt")
      );
    }
  },
  methods: {
    navigationDistance(navigation) {
      return new Distance(
        navigation.routes.items.reduce((dist, route) => {
          return (dist += this.routeDistance(route));
        }, 0)
      );
    },
    routeDistance(route) {
      let dist = 0;
      route.items.reduce((last, wp) => {
        if (last) dist += last.distanceTo(wp);
        return wp;
      }, null);
      return new Distance(dist);
    },
    waypointPair(route, index) {
      if (index + 1 >= route.length) return;
      return [route.items[index], route.items[index + 1]];
    },
    legDistance(route, index) {
      const [current, next] = this.waypointPair(route, index);
      return current.distanceTo(next);
    },
    legBearing(route, index) {
      const [current, next] = this.waypointPair(route, index);
      return current.bearingTo(next);
    },
    legETE(route, index) {
      return this.legDistance(route, index) / this.selectedPace;
    }
  }
};
</script>
