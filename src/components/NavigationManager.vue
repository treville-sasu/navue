<template>
  <b-dropdown :triggers="selectedData ? ['click'] : []" v-bind="$attrs">
    <template v-if="selectedData" #trigger>
      <slot name="default" :selected="selectedData">
        <b-button type="is-primary" icon-right="chevron-down">
          {{ selectedData.name }}
        </b-button>
      </slot>
    </template>

    <template v-else #trigger>
      <b-autocomplete
        placeholder="Open navigation"
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

    <template v-if="selectedData">
      <b-dropdown-item custom>
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

<script>
import { DataManager } from "@/mixins/DataManager";
import { Navigation } from "@/models/Navigation";

export default {
  name: "NavigationManager",
  mixins: [DataManager],
  props: {
    edit: Boolean
  },
  data() {
    return {
      constructor: Navigation,
      searchedProperty: "name"
    };
  },
  computed: {
    selectedData: {
      get() {
        return this.$store.state.currentNavigation;
      },
      set(data) {
        this.$store.commit("currentNavigation", data);
      }
    }
  }
};
</script>
