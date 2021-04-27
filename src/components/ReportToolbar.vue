<template>
  <b-field>
    <b-radio-button
      v-model="modalName"
      native-value="navigation-log"
      :disabled="!navigation"
    >
      <b-tooltip label="Navigation Log">
        <b-icon icon="clipboard-list-outline" />
      </b-tooltip>
    </b-radio-button>

    <b-radio-button
      v-model="modalName"
      native-value="checklists"
      :disabled="!aircraft"
    >
      <b-tooltip label="Checklists">
        <b-icon icon="list-status" />
      </b-tooltip>
    </b-radio-button>
    <b-radio-button v-model="modalName" native-value="vac" disabled>
      <b-tooltip label="VAC">
        <b-icon icon="airport" />
      </b-tooltip>
    </b-radio-button>
    <b-radio-button v-model="modalName" native-value="weather" disabled>
      <b-tooltip label="Weather">
        <b-icon icon="windsock" />
      </b-tooltip>
    </b-radio-button>
    <b-radio-button v-model="modalName" native-value="notam" disabled>
      <b-tooltip label="Notam">
        <b-icon icon="message-flash" />
      </b-tooltip>
    </b-radio-button>
    <b-radio-button v-model="modalName" native-value="notes" disabled>
      <b-tooltip label="Notes">
        <b-icon icon="pencil" />
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

export default {
  name: "ReportToolbar",
  data() {
    return {
      modalName: null,
      modals: {
        "navigation-log": NavigationLog,
        checklists: Checklists
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
    location() {
      return this.$store.state.currentLocation;
    }
  }
};
</script>
