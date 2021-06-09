<template>
  <b-field>
    <b-radio-button
      v-if="navlog"
      v-model="modalName"
      native-value="NavigationLog"
      :disabled="!navigation"
    >
      <b-tooltip label="Navigation Log" v-bind="tooltip">
        <b-icon icon="clipboard-list-outline" v-bind="icon" />
      </b-tooltip>
    </b-radio-button>

    <b-radio-button
      v-if="checklists"
      v-model="modalName"
      native-value="Checklists"
      :disabled="!aircraft"
    >
      <b-tooltip label="Checklists" v-bind="tooltip">
        <b-icon icon="list-status" v-bind="icon" />
      </b-tooltip>
    </b-radio-button>

    <b-radio-button v-if="vac" v-model="modalName" native-value="Vac">
      <b-tooltip label="VAC" v-bind="tooltip">
        <b-icon icon="airport" v-bind="icon" />
      </b-tooltip>
    </b-radio-button>

    <b-radio-button v-if="weather" v-model="modalName" native-value="Weather">
      <b-tooltip label="Weather" v-bind="tooltip">
        <b-icon icon="windsock" v-bind="icon" />
      </b-tooltip>
    </b-radio-button>

    <b-radio-button
      v-if="aip"
      v-model="modalName"
      native-value="AeronauticalInformations"
    >
      <b-tooltip label="AIP & Notams" v-bind="tooltip">
        <b-icon icon="message-flash" v-bind="icon" />
      </b-tooltip>
    </b-radio-button>

    <b-radio-button
      v-if="balance"
      v-model="modalName"
      native-value="Balance"
      :disabled="!aircraft"
    >
      <b-tooltip label="Balance" v-bind="tooltip">
        <b-icon icon="weight" v-bind="icon" />
      </b-tooltip>
    </b-radio-button>
  </b-field>
</template>

<script>
/* eslint-disable vue/no-unused-components */

import NavigationLog from "@/components/NavigationLog";
import Checklists from "@/components/Checklists";
import Vac from "@/components/reports/Vac";
import Weather from "@/components/reports/Weather";
import AeronauticalInformations from "@/components/reports/AeronauticalInformations";
import Balance from "@/components/reports/Balance";

export default {
  name: "ReportToolbar",
  components: {
    NavigationLog,
    Checklists,
    Vac,
    Weather,
    AeronauticalInformations,
    Balance
  },
  props: {
    tooltip: Object,
    icon: Object,
    edit: Boolean,
    navlog: Boolean,
    checklists: Boolean,
    vac: Boolean,
    weather: Boolean,
    aip: Boolean,
    balance: Boolean
  },
  data() {
    return {
      modalName: null
    };
  },
  computed: {
    navigation() {
      return this.$store.state.currentNavigation;
    },
    poi() {
      return this.navigation && this.navigation.poi;
    },
    aircraft() {
      return this.$store.state.currentAircraft;
    },
    flight() {
      return this.$store.state.currentFlight;
    }
  },
  watch: {
    modalName(name) {
      if (name)
        this.modal = this.$buefy.modal.open({
          parent: this,
          component: this.$options.components[name],
          props: { poi: this.poi },
          hasModalCard: false,
          trapFocus: true,
          "append-to-body": true,
          onCancel: () => (this.modalName = undefined)
        });
    }
  }
};
</script>
