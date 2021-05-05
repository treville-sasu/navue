<template>
  <section>
    <b-field grouped group-multiline>
      <b-field label="ICAO Code for FIR or Airports" expanded>
        <b-icao
          v-model="searchCodes"
          maxtags="12"
          :data="avaliableCodes"
          allow-new
          expanded
        />
      </b-field>
      <b-field v-if="poi" label="POI">
        <b-poi v-model="searchCodes" :items="poi" />
      </b-field>
      <b-field label="Message type">
        <b-checkbox-button
          v-model="searchCategories"
          v-for="category in avaliableCategories"
          :key="category"
          :native-value="category"
        >
          {{ category }}
        </b-checkbox-button>
      </b-field>
    </b-field>
    <b-field>
      <b-timer
        ref="searchTimer"
        :duration="1000"
        countdown
        @timesup="getBulletin()"
        type="is-primary"
        size="is-small"
        class="mt-5"
        style="height: 0.35em"
      />
    </b-field>

    <div
      class="block"
      v-for="(stations, category) in resultsMessages"
      :key="category"
    >
      <b-notification
        v-for="(station, key1) in stations"
        :key="`${category}_${station.oaci}`"
        aria-close-label="Close notification"
        @close="$delete(resultsMessages[category], key1)"
      >
        <h4>
          {{ station.oaci }} -
          {{ station.nom }}
        </h4>
        <WeatherMessage
          v-for="(message, key2) in station.messages"
          :key="`${category}_${station.oaci}_${key2}`"
          :message="message"
        />
      </b-notification>
    </div>
  </section>
</template>

<script>
import BIcao from "@/components/buefy/BIcao.vue";
import BPoi from "@/components/buefy/BPoi.vue";
import BTimer from "@/components/buefy/BTimer.vue";

import WeatherMessage from "@/components/WeatherMessage.vue";

import Aeroweb from "@/mixins/Aeroweb";

export default {
  name: "WeatherBulletin",
  components: {
    BIcao,
    BPoi,
    BTimer,
    WeatherMessage
  },
  mixins: [Aeroweb],
  props: {
    poi: Array
  },
  data() {
    return {
      searchCodes: [],
      searchCategories: ["OPMET"],
      resultsMessages: {}
    };
  },
  computed: {
    navigation() {
      return this.$store.state.currentNavigation;
    }
  },
  watch: {
    searchCodes(codes) {
      this.$refs.searchTimer.running
        ? this.$refs.searchTimer.flyback()
        : this.$refs.searchTimer.start();
      if (codes.length == 0) this.$refs.searchTimer.reset();
    },
    searchCategories(newVal, oldVal) {
      oldVal
        .filter(x => !newVal.includes(x))
        .forEach(category => {
          delete this.resultsMessages[category];
        });

      this.getMessages(
        this.searchCodes,
        newVal.filter(x => !oldVal.includes(x))
      );
    }
  },
  methods: {
    getBulletin() {
      this.$refs.searchTimer.hold(async () => {
        await this.getMessages(this.codesList);
      });
    }
  }
};
</script>
