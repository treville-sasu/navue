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
      v-if="notam"
      v-model="modalName"
      native-value="Notam"
      disabled
    >
      <b-tooltip label="Notam" v-bind="tooltip">
        <b-icon icon="message-flash" v-bind="icon" />
      </b-tooltip>
    </b-radio-button>

    <b-radio-button
      v-if="notepad"
      v-model="modalName"
      native-value="Notepad"
      :disabled="!flight"
    >
      <b-tooltip label="Notes" v-bind="tooltip">
        <b-icon icon="pencil" v-bind="icon" />
      </b-tooltip>
    </b-radio-button>

    <b-modal
      :parent="$parent.$parent"
      :component="currentModal"
      v-model="isModalActive"
      :props="{ edit, poi }"
    />
  </b-field>
</template>

<script>
/* eslint-disable vue/no-unused-components */

import NavigationLog from "@/components/NavigationLog";
import Checklists from "@/components/Checklists";
import Vac from "@/components/reports/Vac";
import Weather from "@/components/reports/Weather";
import Notepad from "@/components/Notepad";

export default {
  name: "ReportToolbar",
  components: {
    NavigationLog,
    Checklists,
    Vac,
    Weather,
    Notepad
  },
  props: {
    tooltip: Object,
    icon: Object,
    edit: Boolean,
    navlog: Boolean,
    checklists: Boolean,
    vac: Boolean,
    weather: Boolean,
    notam: Boolean,
    notepad: Boolean
  },
  data() {
    return {
      modalName: null
    };
  },
  computed: {
    currentModal() {
      return this.$options.components[this.modalName];
    },
    isModalActive: {
      get() {
        return !!this.$options.components[this.modalName];
      },
      set() {
        this.modalName = null;
      }
    },
    navigation() {
      return this.$store.state.currentNavigation;
    },
    poi() {
      // TODO send this to Navigation class
      return (
        this.navigation &&
        this.navigation.waypoints
          .map(wp => wp.name)
          .filter(i => /^[A-Z]{4}$/.test(i))
      );
    },
    aircraft() {
      return this.$store.state.currentAircraft;
    },
    // location() {
    //   return this.$store.state.currentLocation;
    // },
    flight() {
      return this.$store.state.currentFlight;
    }
  }
};
</script>
