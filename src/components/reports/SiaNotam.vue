<template>
  <section>
    <b-loading :is-full-page="false" :active="error">
      <b-notification has-icon icon="alert-circle-outline" :closable="false">
        <h4 class="title">SIA Server Unavailable</h4>
        <p class="heading">
          Check your connection or use SIA server directly
        </p>
        <a href="https://www.sia.aviation-civile.gouv.fr/" target="_blank"
          >https://www.sia.aviation-civile.gouv.fr/</a
        >
      </b-notification>
    </b-loading>
    <b-field grouped group-multiline>
      <b-field label="ICAO Code for Airports" expanded>
        <b-icao v-model="searchNotam.codes" maxtags="12" />
      </b-field>
      <b-field v-if="poi" label="POI">
        <b-poi v-model="searchNotam.codes" :items="poi" />
      </b-field>
      <b-field label="Select a date and time">
        <b-datetimepicker
          v-model="searchNotam.datetime"
          rounded
          placeholder="Click to select..."
          icon="calendar-today"
          :min-datetime="new Date()"
          :datepicker="{ 'nearby-month-days': false }"
        >
          <template slot="left">
            <b-button
              class="button is-primary"
              icon-left="clock"
              @click="searchNotam.datetime = new Date()"
              label="Now"
            />
          </template>
        </b-datetimepicker>
      </b-field>
      <b-field label="Duration">
        <b-numberinput
          v-model="searchNotam.duration"
          :step="1"
          :min="0"
          controls-position="compact"
        />
      </b-field>
      <b-field label="Radius or width">
        <b-numberinput
          v-model="searchNotam.radius"
          :step="10"
          :min="0"
          controls-position="compact"
        />
      </b-field>
      <b-field label="Ceiling">
        <b-numberinput
          v-model="searchNotam.ceiling"
          :step="10"
          :min="0"
          controls-position="compact"
        />
      </b-field>
      <b-field label="Flight Rules" position="is-centered">
        <b-radio-button
          v-model="searchNotam.flightrules"
          native-value="VFR"
          type="is-primary"
        >
          VFR
        </b-radio-button>
        <b-radio-button
          v-model="searchNotam.flightrules"
          native-value="IFR/VFR"
          type="is-primary"
        >
          IFR/VFR
        </b-radio-button>
        <b-radio-button
          v-model="searchNotam.flightrules"
          native-value="IFR"
          type="is-primary"
        >
          IFR
        </b-radio-button>
      </b-field>
      <b-field label="Complementary" position="is-centered" expanded>
        <b-checkbox-button
          v-model="searchNotam.complementary"
          type="is-primary"
          native-value="gps"
        >
          GPS
        </b-checkbox-button>
        <b-checkbox-button
          v-model="searchNotam.complementary"
          type="is-primary"
          native-value="misc"
        >
          Misc
        </b-checkbox-button>
      </b-field>
    </b-field>
    <b-field>
      <b-timer
        ref="searchTimer"
        :duration="2000"
        countdown
        @timesup="getNotams()"
        type="is-primary"
        size="is-small"
        class="mt-5"
        style="height: 0.35em"
      />
    </b-field>

    <b-notification
      v-for="(messages, zone) in notams"
      :key="zone"
      aria-close-label="Close notification"
      @close="$delete(notams, zone)"
    >
      <h4>
        {{ zone }}
      </h4>
      <NotamMessage
        :message="message.raw"
        v-for="message in messages"
        :key="message.id"
      />
    </b-notification>
  </section>
</template>

<script>
import BIcao from "@/components/buefy/BIcao.vue";
import BPoi from "@/components/buefy/BPoi.vue";
import BTimer from "@/components/buefy/BTimer.vue";

import NotamMessage from "@/components/NotamMessage.vue";
import Sia from "@/mixins/Sia";

export default {
  name: "SiaNotam",
  components: {
    BIcao,
    BPoi,
    BTimer,
    NotamMessage
  },
  mixins: [Sia],
  props: {
    poi: Array
  },
  data() {
    return {
      error: false,
      searchNotam: {
        codes: [],
        datetime: new Date(),
        duration: 12,
        radius: 10,
        ceiling: 30,
        flightrules: "VFR",
        complementary: ["gps", "misc"]
      },
      notams: []
    };
  },
  computed: {
    poiList() {
      return this.poi.map(id => ({ id, name: id }));
    }
  },
  watch: {
    searchNotam: {
      deep: true,
      handler() {
        this.$refs.searchTimer.flyback();
        if (!this.$refs.searchTimer.running) this.$refs.searchTimer.start();
        if (this.searchNotam.codes.length == 0) this.$refs.searchTimer.reset();
      }
    }
  },
  methods: {
    getNotams() {
      const datetime = new Date(
        Math.max(this.searchNotam.datetime, new Date())
      );
      this.$refs.searchTimer.hold(async () => {
        this.notams = [];
        this.notams = await this.getAirportNOTAMs({
          ...this.searchNotam,
          datetime
        });
      });
    }
  }
};
</script>
