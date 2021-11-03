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
                {{ navigation.length | as("NM", 2) }}
              </p>
            </div>
          </div>
          <div class="level-item has-text-centered">
            <div>
              <p class="heading">
                Routes
              </p>
              <p class="title">
                {{ navigation.branches.length }}
              </p>
            </div>
          </div>
          <div class="level-item has-text-centered">
            <div>
              <p class="heading">
                Flight Time
              </p>
              <p class="title">
                {{ (navigation.length * currentSpeed) | asDuration }}
              </p>
            </div>
          </div>
        </nav>
        <b-field label="Notes" label-position="on-border">
          <b-notepad v-model="navigation.properties.notes" />
        </b-field>
      </b-tab-item>
      <b-tab-item
        v-for="(route, index) in navigation.branches"
        :key="index"
        :label="`${index + 1}`"
        icon="chevron-triple-right"
      >
        <waypoint-content
          v-for="(wp, index) in route.features"
          :value.sync="route.features[index]"
          :key="index"
        />
      </b-tab-item>
    </b-tabs>
  </section>
</template>

<script>
// import { Distance } from "@/models/Quantities";

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
  }
};
</script>
