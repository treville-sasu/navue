<template>
  <div class="columns is-multiline is-centered">
    <div class="column" v-if="select">
      <div class="box">
        <b-field label="Choose an aircraft" v-if="!value">
          <b-autocomplete
            placeholder="F-Pxx, Nxxx"
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
            <template slot="header" v-if="create">
              <a @click="useData({ type: 'aircraft' })">
                <span> Create a new one... </span>
              </a>
            </template>
            <template slot="empty"> No results for {{ search }}</template>
          </b-autocomplete>
        </b-field>
        <b-button
          v-if="value"
          @click="useData(null)"
          icon-left="selection-off"
          type="is-primary"
          expanded
          label="Discard"
        />
        <!-- //FIXME : Should close modal if it exists -->
        <b-button
          v-if="$route.name != 'Aircraft'"
          tag="router-link"
          :to="{
            name: 'Aircraft'
          }"
          icon-left="circle-edit-outline"
          type="is-primary"
          expanded
          label="Manage Aircrafts"
        />
      </div>
    </div>
    <div class="column" v-if="create">
      <div class="box">
        <b-field class="file" v-if="!value">
          <b-upload
            v-model="upload"
            accept="application/json"
            @input="importData"
            drag-drop
            expanded
          >
            <div class="content has-text-centered">
              <p>
                <b-icon icon="upload" size="is-large"></b-icon>
              </p>
              <p>Upload Aircraft data</p>
            </div>
          </b-upload>
        </b-field>
        <b-button
          v-if="value"
          @click="useData(cloneData(value))"
          icon-left="plus-circle-multiple-outline"
          type="is-primary"
          expanded
          label="Clone aircraft"
        />
      </div>
    </div>
    <div class="column" v-if="value && save">
      <div class="box buttons">
        <b-button
          v-if="isSaved"
          @click="exportData"
          icon-left="download-outline"
          type="is-primary"
          expanded
          label="Download"
        />
        <b-button
          v-if="!isSaved"
          @click="saveData"
          icon-left="cloud-upload-outline"
          type="is-warning"
          expanded
          label="Save"
        />
        <b-button
          v-if="fromDB"
          @click="deleteData"
          icon-left="delete-outline"
          type="is-danger"
          expanded
          label="Delete"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { DataSelect } from "@/mixins/DataSelect";

export default {
  name: "AircraftSelect",
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
    }
  }
};
</script>
