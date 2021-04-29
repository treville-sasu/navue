<template>
  <b-dropdown v-bind="$attrs">
    <template #trigger>
      <slot name="default" :selected="selectedData">
        <b-button>
          <b-tooltip
            position="is-bottom"
            :label="selectedData ? selectedData.registration : 'Aircraft'"
          >
            <b-icon icon="airplane" :type="selectedData ? 'is-success' : ''" />
          </b-tooltip>
        </b-button>
      </slot>
    </template>

    <template v-if="selectedData">
      <b-dropdown-item custom v-if="$slots.header || $scopedSlots.header">
        <slot name="header" :selected="selectedData" />
      </b-dropdown-item>
      <b-dropdown-item separator v-if="$slots.header || $scopedSlots.header" />

      <template v-if="edit">
        <b-dropdown-item @click="saveData">
          <b-icon icon="cloud-upload-outline" type="is-warning" />
          Save
        </b-dropdown-item>
        <b-dropdown-item @click="exportData">
          <b-icon icon="download-outline" />
          Export
        </b-dropdown-item>
        <b-dropdown-item
          @click="selectedData = cloneData(selectedData)"
          :disabled="!fromDB"
          v-if="create"
        >
          <b-icon icon="plus-circle-multiple-outline" />
          Clone
        </b-dropdown-item>
        <b-dropdown-item @click="deleteData" :disabled="!fromDB">
          <b-icon icon="delete-outline" type="is-danger" />
          Delete
        </b-dropdown-item>
      </template>
      <b-dropdown-item @click="selectedData = undefined">
        <b-icon icon="selection-off" />
        Discard
      </b-dropdown-item>
    </template>

    <template v-else>
      <b-dropdown-item custom>
        <b-autocomplete
          placeholder="Choose an aircraft"
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
          <template #empty>
            <i>{{ search }}</i> not found
          </template>
        </b-autocomplete>
      </b-dropdown-item>
      <b-dropdown-item @click="createData" v-if="create">
        <b-icon icon="plus-circle-outline" />
        New Aircraft
      </b-dropdown-item>
      <b-dropdown-item v-if="create">
        <b-upload
          v-model="upload"
          accept="application/json"
          @input="importData"
        >
          <b-icon icon="upload" />
          Import
        </b-upload>
      </b-dropdown-item>
    </template>

    <b-dropdown-item has-link v-if="$route.name != 'Aircraft'">
      <router-link :to="{ name: 'Aircraft' }">
        Manage Aircrafts
      </router-link>
    </b-dropdown-item>
  </b-dropdown>
</template>

<style scoped>
.upload .upload-draggable {
  padding: 0.25em;
  border: 0;
}
</style>

<script>
import { DataManager } from "@/mixins/DataManager";
import { Aircraft } from "@/models/Aircraft";

export default {
  name: "AircraftManager",
  mixins: [DataManager],
  data() {
    return {
      constructor: Aircraft,
      storeKey: "currentAircraft",
      searchedProperty: "registration"
    };
  }
};
</script>
