<template>
  <section>
    <section class="hero is-primary is-hidden-mobile" v-if="notams.length == 0">
      <div class="hero-body">
        <div class="container">
          <h1 class="title">Notices to Airmen</h1>
          <h2 class="subtitle">Get NOTAMs & AZBA activity</h2>
        </div>
      </div>
    </section>
    <div
      class="notification"
      v-bind:class="{ 'is-loading': azba.length == 0 && !error }"
    >
      <div
        class="message level is-warning is-overlay"
        v-bind:class="{ 'is-hidden': !error }"
        style="z-index: 6; margin-bottom: 0"
      >
        <div class="level-item has-text-centered" style="display: inline-block">
          <h4 class="title">
            <b-icon
              icon="alert-circle-outline"
              type="is-danger"
              size="is-large"
            />
            SIA Server Unavailable
          </h4>
          <p class="heading">
            Check your connection or use SIA server directly
          </p>
          <a href="https://www.sia.aviation-civile.gouv.fr/" target="_blank"
            >https://www.sia.aviation-civile.gouv.fr/</a
          >
        </div>
      </div>
      <b-field grouped group-multiline>
        <b-field label="ICAO Code for Airports" expanded>
          <b-icao v-model="notam.codes" maxtags="12" />
        </b-field>
        <b-field label="Select a date and time">
          <b-datetimepicker
            v-model="notam.datetime"
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
                @click="notam.datetime = new Date()"
                label="Now"
              />
            </template>
          </b-datetimepicker>
        </b-field>
      </b-field>
      <b-field grouped group-multiline>
        <b-field label="Duration">
          <b-numberinput
            v-model="notam.duration"
            :step="1"
            :min="0"
            controls-position="compact"
          />
        </b-field>
        <b-field label="Radius or width">
          <b-numberinput
            v-model="notam.radius"
            :step="10"
            :min="0"
            controls-position="compact"
          />
        </b-field>
        <b-field label="Ceiling">
          <b-numberinput
            v-model="notam.ceiling"
            :step="10"
            :min="0"
            controls-position="compact"
          />
        </b-field>
        <b-field label="Flight Rules" position="is-centered">
          <b-radio-button
            v-model="notam.flightrules"
            native-value="VFR"
            type="is-primary"
          >
            VFR
          </b-radio-button>
          <b-radio-button
            v-model="notam.flightrules"
            native-value="IFR/VFR"
            type="is-primary"
          >
            IFR/VFR
          </b-radio-button>
          <b-radio-button
            v-model="notam.flightrules"
            native-value="IFR"
            type="is-primary"
          >
            IFR
          </b-radio-button>
        </b-field>
        <b-field label="Complementary" position="is-centered" expanded>
          <b-checkbox-button
            v-model="notam.complementary"
            type="is-primary"
            native-value="gps"
          >
            GPS
          </b-checkbox-button>
          <b-checkbox-button
            v-model="notam.complementary"
            type="is-primary"
            native-value="misc"
          >
            Misc
          </b-checkbox-button>
        </b-field>
      </b-field>
      <b-button @click="getNotams">Submit</b-button>
    </div>

    <section class="section" v-if="notams.length > 0">
      <h2 class="subtitle">Notams ({{ notams.length }}) :</h2>
      <div class="box" v-for="(message, key) in notams" :key="'notam' + key">
        <NotamMessage :message="message" />
      </div>
    </section>
    <section class="section" v-if="azba.length > 0">
      <h2 class="subtitle">Cartes AZBA ({{ azba.length }}) :</h2>
      <div class="columns is-multiline">
        <div
          class="column is-one-quarter"
          v-for="(map, key) in azba"
          :key="'azba' + key"
        >
          <ChartCartridge
            v-bind="map"
            :name="map.date | asDay"
            :tags="{
              danger: 'RTBA',
              warning: $options.filters.asTime(map.start),
              success: $options.filters.asTime(map.end)
            }"
            @click="openChartUrl = $event"
            card
          >
            <figure class="image">
              <pdf :src="proxyUrl(map.url)" :page="1" style="height: 100%" />
            </figure>
          </ChartCartridge>
        </div>
        <PDFModal v-model="proxyChartUrl" :active="!!proxyChartUrl" />
      </div>
    </section>
  </section>
</template>

<script>
import BIcao from "@/components/BIcao.vue";

import NotamMessage from "@/components/NotamMessage.vue";
import ChartCartridge from "@/components/ChartCartridge.vue";
import PDFModal from "@/components/PDFModal.vue";
import Sia from "@/mixins/Sia";

import Pdf from "vue-pdf";

export default {
  name: "Notam",
  components: {
    BIcao,
    NotamMessage,
    ChartCartridge,
    PDFModal,
    Pdf
  },
  mixins: [Sia],
  data() {
    return {
      error: false,
      notam: {
        codes: [],
        datetime: new Date(),
        duration: 12,
        radius: 10,
        ceiling: 990,
        flightrules: "VFR",
        complementary: ["gps", "misc"]
      },
      azba: [],
      openChartUrl: null,
      notams: []
    };
  },
  async mounted() {
    try {
      this.azba = await this.getAZBAfiles(this.AZBASourceUrl);
    } catch {
      this.error = true;
    }
  },
  computed: {
    proxyChartUrl: {
      get() {
        return this.openChartUrl ? this.proxyUrl(this.openChartUrl) : null;
      },
      set(val) {
        this.openChartUrl = val;
      }
    }
  },
  methods: {
    async getNotams() {
      this.notams = await this.getAirportNOTAMs(
        this.notam,
        this.NOTAMSourceUrl
      );
    }
  },
  filters: {
    asTime(value) {
      return value.toLocaleString("fr-fr", {
        timeZone: "UTC",
        timeZoneName: "short",
        hour12: false,
        hour: "2-digit",
        minute: "2-digit"
      });
    },
    asDay(value) {
      return value.toLocaleString("fr-fr", {
        timeZone: "UTC",
        weekday: "long",
        day: "numeric",
        month: "long"
      });
    }
  }
};
</script>
