<template>
  <section>
    <b-field label="Airports & Waypoints" grouped>
      <b-icao
        v-model="query.codes"
        maxtags="12"
        :presets="poi"
        @typing="unbounce"
        expanded
      />
      <b-field>
        <b-radio-button v-model="query.type" native-value="R_ETROITE">
          Route
        </b-radio-button>
        <b-radio-button v-model="query.type" native-value="AERO">
          Aerodromes
        </b-radio-button>
      </b-field>
    </b-field>
    <b-collapse :open="false" position="is-bottom">
      <template #trigger="props">
        <b-icon :icon="!props.open ? 'menu-down' : 'menu-up'"></b-icon>
        {{ !props.open ? "All options" : "Fewer options" }}
      </template>

      <b-field grouped group-multiline>
        <b-field label="Select a date and time">
          <b-datetimepicker
            v-model="query.datetime"
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
                @click="query.datetime = new Date()"
                label="Now"
              />
            </template>
          </b-datetimepicker>
        </b-field>
        <b-field label="Duration">
          <b-numberinput
            v-model="query.duration"
            :step="1"
            :min="0"
            controls-position="compact"
          />
        </b-field>
        <b-field label="Width">
          <b-numberinput
            v-model="query.width"
            :step="10"
            :min="0"
            controls-position="compact"
          />
        </b-field>
        <b-field label="Levels" expanded>
          <b-slider
            v-model="query.levels"
            :step="10"
            :min="0"
            :max="999"
            lazy
            indicator
            :tooltip="false"
          />
        </b-field>
        <b-field label="Flight Rules" position="is-centered">
          <b-radio-button
            v-model="query.flightrules"
            native-value="VFR"
            type="is-primary"
          >
            VFR
          </b-radio-button>
          <b-radio-button
            v-model="query.flightrules"
            native-value="IFR/VFR"
            type="is-primary"
          >
            IFR/VFR
          </b-radio-button>
          <b-radio-button
            v-model="query.flightrules"
            native-value="IFR"
            type="is-primary"
          >
            IFR
          </b-radio-button>
        </b-field>
        <b-field label="Complementary" position="is-centered" expanded>
          <b-checkbox-button
            v-model="query.complementary"
            type="is-primary"
            native-value="gps"
          >
            GPS
          </b-checkbox-button>
          <b-checkbox-button
            v-model="query.complementary"
            type="is-primary"
            native-value="misc"
          >
            Misc
          </b-checkbox-button>
          <b-checkbox-button
            v-model="query.complementary"
            type="is-primary"
            native-value="flyover"
          >
            Flyover
          </b-checkbox-button>
        </b-field>
      </b-field>
    </b-collapse>

    <b-notification
      has-icon
      icon="alert-circle-outline"
      :closable="false"
      v-if="error"
    >
      <h4 class="title">SIA Server Unavailable</h4>
      <p class="heading">
        Check your connection or use SIA server directly
      </p>
      <a href="http://notamweb.aviation-civile.gouv.fr/" target="_blank"
        >http://notamweb.aviation-civile.gouv.fr/</a
      >
    </b-notification>
    <div class="placeholder" v-else-if="!Object.keys(results).length">
      Search for NOTAMs.
      <b-loading :is-full-page="false" :active="isLoading" />
    </div>
    <b-message
      v-else
      v-for="(messages, zone) in results"
      :key="zone"
      :closable="false"
    >
      <template #header> {{ zone }} </template>
      <NotamMessage
        :message="message.raw"
        v-for="message in messages"
        :key="message.id"
      />
    </b-message>
  </section>
</template>

<script>
import BIcao from "@/components/buefy/BIcao.vue";
import NotamMessage from "@/components/NotamMessage.vue";

import Sia from "@/mixins/Sia";
import CachableSearch from "@/mixins/CachableSearch";

export default {
  name: "SiaNotam",
  components: {
    BIcao,
    NotamMessage
  },
  mixins: [CachableSearch],
  data() {
    return {
      type: "notam",
      query: {
        codes: [],
        type: "R_ETROITE",
        datetime: new Date(),
        duration: 6,
        width: 10,
        levels: [0, 50],
        flightrules: "VFR",
        complementary: ["gps", "misc", "flyover"]
      },
      instance: new Sia(),
      error: false
    };
  },

  methods: {
    async search() {
      this.results = [];

      if (this.query.codes.length) {
        this.isLoading = true;
        // new Date(Math.max(this.query.datetime, new Date()));
        try {
          this.results = await this.instance.getNOTAM(this.query);
          this.error = false;
        } catch (e) {
          console.debug(e);
          this.error = true;
        }
        this.isLoading = false;
      }
    }
  }
};
</script>
