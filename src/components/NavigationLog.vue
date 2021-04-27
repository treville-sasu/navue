<template>
  <section class="section">
    <b-tabs v-model="selectedRoute" class="box" multiline>
      <b-tab-item label="Summary" icon="file-replace-outline">
        <b-field label="Average Speed" horizontal addons>
          <b-numberinput v-model="selectedPace.value" :controls="false" />
          <b-select v-model="selectedPace.unit" required>
            <option
              v-for="(ratio, name) in selectedPace.constructor.units"
              :value="name"
              :key="name"
            >
              {{ name }}
            </option>
          </b-select>
          <b-select v-model="selectedPace" placeholder="aircraft pace">
            <option v-if="currentSpeed" :value="currentSpeed">
              Current speed ({{ currentSpeed }})
            </option>
            <option
              v-for="option in aircraftPaces"
              :value="option"
              :key="option.name"
            >
              {{ option.name }} ({{ option }})
            </option>
          </b-select>
        </b-field>
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
                Total Time
              </p>
              <p class="title">
                {{ navigationETE(navigation) | asDuration(1000) }}
              </p>
            </div>
          </div>
          <div class="level-item has-text-centered">
            <div>
              <p class="heading">
                Fuel Burned
              </p>
              <p class="title">
                - L
              </p>
            </div>
          </div>
        </nav>
      </b-tab-item>
      <b-tab-item
        v-for="(route, index) in navigation.routes"
        :key="index"
        :label="`${index + 1}`"
        icon="chevron-triple-right"
      >
        <table class="table is-narrow is-hoverable is-fullwidth">
          <thead>
            <colgroup>
              <col span="3" />
              <col span="3" />
            </colgroup>
            <tr>
              <th>Waypoint</th>
              <th>Alt.</th>
              <th>Notes</th>
              <th>Bearing</th>
              <th>Distance</th>
              <th>ETE</th>
            </tr>
          </thead>
          <tfoot>
            <tr>
              <th></th>
              <th>min Alt.</th>
              <th></th>
              <th></th>
              <th class="has-text-right">
                {{ routeDistance(route) | as("NM", 3) }}
              </th>
              <th class="has-text-right">
                {{ routeETE(route) | asDuration(1000) }}
              </th>
            </tr>
          </tfoot>
          <tbody>
            <template v-for="(wp, index) in route">
              <tr :key="'wp_' + index">
                <td rowspan="2">
                  <span class="button is-static"> {{ index }}</span>
                  {{ wp.name }}
                </td>
                <td class="has-text-right" rowspan="2">
                  {{ wp.altitude }}
                </td>
                <td rowspan="2">
                  {{ wp.notes }}
                </td>
                <td v-if="index == 0" colspan="3" height="1em"></td>
              </tr>
              <tr v-if="index + 1 < route.length" :key="'leg_' + index">
                <td class="has-text-right" rowspan="2">
                  {{ legBearing(route, index) }}
                </td>
                <td class="has-text-right" rowspan="2">
                  {{ legDistance(route, index) | as("NM", 3) }}
                </td>
                <td class="has-text-right" rowspan="2">
                  {{ legETE(route, index) | asDuration(1000) }}
                </td>
              </tr>
              <tr v-else :key="'fill_' + index">
                <td colspan="2" height="1em"></td>
              </tr>
            </template>
          </tbody>
        </table>
      </b-tab-item>
    </b-tabs>
  </section>
</template>

<script>
import { Distance, Speed } from "@/models/Quantities";

import UnitSystem from "@/mixins/UnitSystem";

export default {
  name: "NavigationLog",
  mixins: [UnitSystem],
  props: {
    pace: Speed
  },
  data() {
    return {
      selectedRoute: undefined,
      selectedPace: new Speed()
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
    navigationETE(navigation) {
      return this.navigationDistance(navigation) / this.selectedPace;
    },
    routeDistance(route) {
      let dist = 0;
      route.items.reduce((last, wp) => {
        if (last) dist += last.distanceTo(wp);
        return wp;
      }, null);
      return new Distance(dist);
    },
    routeETE(route) {
      return this.routeDistance(route) / this.selectedPace;
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
