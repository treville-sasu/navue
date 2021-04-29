<template>
  <b-field>
    <b-radio-button
      v-model="modalName"
      native-value="navigation-log"
      :disabled="!navigation"
    >
      <b-tooltip label="Navigation Log" v-bind="tooltip">
        <b-icon icon="clipboard-list-outline" v-bind="icon" />
      </b-tooltip>
    </b-radio-button>

    <b-radio-button
      v-model="modalName"
      native-value="checklists"
      :disabled="!aircraft"
    >
      <b-tooltip label="Checklists" v-bind="tooltip">
        <b-icon icon="list-status" v-bind="icon" />
      </b-tooltip>
    </b-radio-button>
    <b-radio-button v-model="modalName" native-value="vac" disabled>
      <b-tooltip label="VAC" v-bind="tooltip">
        <b-icon icon="airport" v-bind="icon" />
      </b-tooltip>
    </b-radio-button>
    <b-radio-button v-model="modalName" native-value="weather" disabled>
      <b-tooltip label="Weather" v-bind="tooltip">
        <b-icon icon="windsock" v-bind="icon" />
      </b-tooltip>
    </b-radio-button>
    <b-radio-button v-model="modalName" native-value="notam" disabled>
      <b-tooltip label="Notam" v-bind="tooltip">
        <b-icon icon="message-flash" v-bind="icon" />
      </b-tooltip>
    </b-radio-button>
    <b-radio-button
      v-model="modalName"
      native-value="notepad"
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
    />
  </b-field>
</template>

<script>
import NavigationLog from "@/components/NavigationLog";
import Checklists from "@/components/Checklists";
import Notepad from "@/components/Notepad";

export default {
  name: "ReportToolbar",
  props: { tooltip: Object, icon: Object },
  data() {
    return {
      modalName: null,
      modals: {
        "navigation-log": NavigationLog,
        checklists: Checklists,
        notepad: Notepad
      }
    };
  },
  computed: {
    currentModal() {
      return this.modals[this.modalName];
    },
    isModalActive: {
      get() {
        return !!this.modals[this.modalName];
      },
      set() {
        this.modalName = null;
      }
    },
    navigation() {
      return this.$store.state.currentNavigation;
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
