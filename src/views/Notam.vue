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
    <div class="notification">
      <b-loading :is-full-page="false" :active="azba.length == 0 && !error" />
      <b-loading :is-full-page="false" :active="error">
        <b-notification
          has-icon
          icon="alert-circle-outline"
          :closable="false"
          aria-close-label="Close notification"
        >
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
      </b-field>
      <b-field grouped group-multiline>
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
      <b-button @click="getNotams">Submit</b-button>
    </div>

    <section class="section" v-if="Object.keys(notams).length > 0">
      <h2 class="subtitle">Notams :</h2>
      <div class="box" v-for="(messages, zone) in notams" :key="zone">
        <h4>{{ zone }}</h4>
        <NotamMessage
          :message="message.raw"
          v-for="message in messages"
          :key="message.id"
        />
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
            :name="map.start | asDay"
            :tags="{
              danger: 'RTBA',
              warning: $options.filters.asTime(map.start),
              success: $options.filters.asTime(map.end),
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
    Pdf,
  },
  mixins: [Sia],
  data() {
    return {
      error: false,
      searchNotam: {
        codes: [],
        datetime: new Date(),
        duration: 12,
        radius: 10,
        ceiling: 990,
        flightrules: "VFR",
        complementary: ["gps", "misc"],
      },
      azba: [],
      openChartUrl: null,
      notams: [],
    };
  },
  async mounted() {
    this.azba = this.getAZBA(this.AZBASourceUrl);
  },
  computed: {
    proxyChartUrl: {
      get() {
        return this.openChartUrl ? this.proxyUrl(this.openChartUrl) : null;
      },
      set(val) {
        this.openChartUrl = val;
      },
    },
  },
  methods: {
    async getNotams() {
      this.notams = await this.getAirportNOTAMs(
        this.searchNotam,
        this.NOTAMSourceUrl
      );
    },
    async getAZBA(url) {
      try {
        clearTimeout(this.error);
        this.error = false;
        return await this.getAZBAfiles(url);
      } catch (err) {
        console.error(err);
        this.error = setTimeout(this.getAZBA, 3000, url);
      }
    },
  },
  filters: {
    asTime(value) {
      return value.toLocaleString("fr-fr", {
        timeZone: "UTC",
        timeZoneName: "short",
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
      });
    },
    asDay(value) {
      return value.toLocaleString("fr-fr", {
        timeZone: "UTC",
        weekday: "long",
        day: "numeric",
        month: "long",
      });
    },
  },
};
</script>
