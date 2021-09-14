<template>
  <b-field>
    <b-radio-button
      v-if="navlog"
      v-model="modalName"
      native-value="NavigationLog"
      :disabled="!gotNavigation"
    >
      <b-tooltip label="Navigation Log" v-bind="tooltip">
        <b-icon icon="clipboard-list-outline" v-bind="icon" />
      </b-tooltip>
    </b-radio-button>

    <b-radio-button
      v-if="checklists"
      v-model="modalName"
      native-value="Checklists"
      :disabled="!gotAircraft"
    >
      <b-tooltip label="Checklists" v-bind="tooltip">
        <b-icon icon="list-status" v-bind="icon" />
      </b-tooltip>
    </b-radio-button>

    <b-radio-button v-if="vac" v-model="modalName" native-value="SiaVac">
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
      :disabled="!gotAircraft"
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
import SiaVac from "@/components/reports/SiaVac";
import Weather from "@/components/reports/Weather";
import AeronauticalInformations from "@/components/reports/AeronauticalInformations";
import Balance from "@/components/reports/Balance";

export default {
  name: "ReportToolbar",
  components: {
    NavigationLog,
    Checklists,
    SiaVac,
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
    gotNavigation() {
      return !!this.$store.state.currentNavigation;
    },
    gotAircraft() {
      return !!this.$store.state.currentAircraft;
    }
  },
  watch: {
    modalName(name) {
      if (name)
        this.modal = this.$buefy.modal.open({
          parent: this,
          component: this.$options.components[name],
          hasModalCard: false,
          trapFocus: true,
          appendToBody: true,
          onCancel: () => (this.modalName = undefined)
        });
    }
  }
};
</script>
