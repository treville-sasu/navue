<template>
  <b-dropdown v-bind="$attrs">
    <template #trigger>
      <slot name="default" :selected="selectedData">
        <b-button>
          <b-tooltip
            position="is-bottom"
            :label="selectedData ? selectedData.name || 'new' : 'Flight'"
          >
            <b-icon
              icon="go-kart-track"
              :type="selectedData ? 'is-success' : ''"
            />
          </b-tooltip>
        </b-button>
      </slot>
    </template>

    <template v-if="selectedData">
      <b-dropdown-item custom v-if="$slots.header || $scopedSlots.header">
        <slot name="header" :selected="selectedData" />
      </b-dropdown-item>
      <b-dropdown-item separator v-if="$slots.header || $scopedSlots.header" />

      <template v-if="persistent && build">
        <b-dropdown-item
          @click="importLocations() && saveData() && deleteLocations()"
        >
          <b-icon icon="cloud-upload-outline" type="is-warning" />
          Save
        </b-dropdown-item>
        <b-dropdown-item @click="deleteLocations" v-if="traceDB">
          <b-icon icon="map-marker-remove-outline" type="is-danger" />Delete
          trace
        </b-dropdown-item>
      </template>
      <template v-else-if="edit">
        <!-- <b-dropdown-item @click="saveData">
          <b-icon icon="cloud-upload-outline" type="is-warning" />
          Save
        </b-dropdown-item> -->

        <b-dropdown-item @click="exportData">
          <b-icon icon="download-outline" />
          Export
        </b-dropdown-item>

        <b-dropdown-item @click="deleteData" :disabled="!fromDB">
          <b-icon icon="delete-outline" type="is-danger" />
          Delete
        </b-dropdown-item>
      </template>
      <b-dropdown-item
        @click="persistent ? createData : () => (selectedData = undefined)"
      >
        <b-icon icon="selection-off" />
        Discard
      </b-dropdown-item>
    </template>

    <template v-else>
      <b-autocomplete
        placeholder="Open Flight"
        v-model="search"
        :data="availableData || []"
        @select="selectedData = $event"
        :field="searchedProperty"
        open-on-focus
        keep-first
        clear-on-select
        clearable
        append-to-body
      >
        <template #header v-if="edit">
          <a @click="selectedData = new constructor({ name: search })">
            <span> Create {{ search }}</span>
          </a>
        </template>
        <template #footer v-if="edit">
          <b-field class="file is-primary">
            <b-upload
              class="file-label"
              v-model="upload"
              accept="application/json"
              @input="importData"
            >
              <span class="file-cta">
                <b-icon icon="upload" />
                <span>Import from file</span>
              </span>
            </b-upload>
          </b-field>
        </template>
        <template #empty v-if="!edit">
          <span>
            "<i>{{ search }}</i
            >" not found</span
          >
        </template>
      </b-autocomplete>
    </template>
  </b-dropdown>
</template>

<script>
import { DataManager } from "@/mixins/DataManager";
import { Flight } from "@/models/Flight";

export default {
  name: "FlightManager",
  mixins: [DataManager],
  props: {
    build: Boolean,
    traceDB: String
  },
  data() {
    return {
      constructor: Flight,
      storeKey: "currentFlight",
      searchedProperty: "name"
    };
  },
  methods: {
    async importLocations() {
      let { rows } = await this.$pouch[this.traceDB].allDocs({
        include_docs: true
      });
      rows.forEach(l => this.selectedData.addLocation(l.doc));
    },
    async deleteLocations() {
      // FIXME this do not update the livefeed in other components.
      // update vue-pouchdb-lite with destroy event handling
      await this.$pouch[this.traceDB].destroy();
    }
  }
};
</script>
