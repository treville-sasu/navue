<template>
  <b-dropdown :triggers="selectedData ? ['click'] : []" v-bind="$attrs">
    <template v-if="selectedData" #trigger>
      <slot name="default" :selected="selectedData">
        <b-button type="is-primary" icon-right="chevron-down">
          {{ selectedData.registration || "new" }}
        </b-button>
      </slot>
    </template>

    <template v-else #trigger>
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
      >
        <template #header v-if="edit">
          <a @click="selectedData = new constructor({ registration: search })">
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
          <ul class="content">
            <li>
              <i>{{ search }}</i> not found
            </li>
            <li>
              <router-link :to="{ name: 'Aircraft' }">
                <a>Manage Aircrafts</a>
              </router-link>
            </li>
          </ul>
        </template>
      </b-autocomplete>
    </template>

    <template v-if="selectedData">
      <b-dropdown-item custom v-if="$slots.header">
        <slot name="header" :selected="selectedData" />
      </b-dropdown-item>
      <b-dropdown-item @click="saveData" v-if="edit">
        <b-icon icon="cloud-upload-outline" type="is-warning" />
        Save
      </b-dropdown-item>
      <b-dropdown-item @click="selectedData = undefined">
        <b-icon icon="selection-off" />
        Discard
      </b-dropdown-item>
      <b-dropdown-item
        @click="selectedData = cloneData(selectedData)"
        :disabled="!fromDB"
        v-if="edit"
      >
        <b-icon icon="plus-circle-multiple-outline" />
        Clone
      </b-dropdown-item>
      <b-dropdown-item @click="exportData" v-if="edit">
        <b-icon icon="download-outline" />
        Download
      </b-dropdown-item>
      <b-dropdown-item @click="deleteData" :disabled="!fromDB" v-if="edit">
        <b-icon icon="delete-outline" type="is-danger" />
        Delete
      </b-dropdown-item>
    </template>
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
  props: {
    edit: Boolean
  },
  data() {
    return {
      constructor: Aircraft,
      searchedProperty: "registration"
    };
  },
  computed: {
    selectedData: {
      get() {
        return this.$store.state.currentAircraft;
      },
      set(val) {
        this.$store.commit("currentAircraft", val);
      }
    }
  }
};
</script>
