<template>
  <div class="container">
    <b-field position="is-centered" grouped group-multiline v-if="selectedData">
      <p class="control">
        <b-button
          @click="useData(null)"
          icon-left="selection-off"
          type="is-light is-primary"
          label="Discard"
        />
      </p>
      <p class="control">
        <b-button
          v-if="create"
          @click="useData(cloneData(selectedData))"
          icon-left="plus-circle-multiple-outline"
          type="is-light is-primary"
          label="Clone"
        />
      </p>
      <p class="control">
        <b-button
          @click="exportData"
          icon-left="download-outline"
          type="is-light is-primary"
          label="Download"
        />
      </p>
      <p class="control">
        <b-button
          v-if="save"
          @click="saveData"
          icon-left="cloud-upload-outline"
          type="is-light is-warning"
          label="Save"
        />
      </p>
      <p class="control">
        <b-button
          v-if="fromDB && save"
          @click="deleteData"
          icon-left="delete-outline"
          type="is-light is-danger"
          label="Delete"
        />
      </p>
    </b-field>
    <b-field position="is-centered" grouped group-multiline v-else>
      <b-autocomplete
        v-if="select"
        placeholder="Choose"
        v-model="search"
        :data="availableData || []"
        @select="useData"
        icon="magnify"
        field="registration"
        open-on-focus
        keep-first
        clear-on-select
        clearable
      >
        <template slot="empty">No results for {{ search }}</template>
      </b-autocomplete>
      <b-field>
        <b-button
          v-if="create"
          @click="useData(newAircraft)"
          icon-left="plus-circle-outline"
          type="is-link"
          label="Create"
        />
      </b-field>
      <b-field class="file is-primary">
        <b-upload
          class="file-label"
          v-if="create"
          v-model="upload"
          accept="application/json"
          @input="importData"
        >
          <!-- drag-drop -->
          <span class="file-cta">
            <b-icon icon="upload" />
            <span>Import data</span>
          </span>
        </b-upload>
      </b-field>
    </b-field>
  </div>
</template>

<style scoped>
.upload .upload-draggable {
  padding: 0.25em;
  border: 0;
}
</style>

<script>
import { DataSelect } from "@/mixins/DataSelect";
import { Aircraft } from "@/models/Aircraft";

export default {
  name: "AircraftManager",
  mixins: [DataSelect],
  props: {
    select: Boolean,
    create: Boolean,
    save: Boolean
  },
  data() {
    return {
      dataType: "aircraft"
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
    },
    newAircraft() {
      return new Aircraft();
    }
  }
};
</script>
