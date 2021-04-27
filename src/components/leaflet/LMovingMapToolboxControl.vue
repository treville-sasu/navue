<template>
  <l-control v-bind="$attrs">
    <NavigationManager position="is-top-right">
      <template #default>
        <b-button>
          <b-tooltip label="Open Navigation">
            <b-icon icon="map-marker-path" />
          </b-tooltip>
        </b-button>
      </template>
      <template #header="{ selected }">
        {{ selected.name }}
      </template>
    </NavigationManager>
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
    </b-field>
    <b-button disabled>
      <b-tooltip label="Save Trace">
        <b-icon icon="record-rec" />
      </b-tooltip>
    </b-button>
    <b-modal
      :parent="$parent.$parent"
      :component="currentModal"
      v-model="isModalActive"
    />
  </l-control>
</template>

<script>
import { LControl } from "vue2-leaflet";
import NavigationManager from "@/components/NavigationManager";
import NavigationLog from "@/components/NavigationLog";
import Checklists from "@/components/Checklists";

export default {
  name: "LMovingMapToolboxControl",
  components: {
    LControl,
    NavigationManager
  },
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
