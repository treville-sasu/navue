<template>
  <div class="columns is-multiline is-centered">
    <div class="column">
      <div class="box">
        <b-field label="Choose a navigation" v-if="!selectedData">
          <b-autocomplete
            placeholder="LFxx > LFxx..."
            v-model="search"
            :data="availableData || []"
            @select="useData"
            icon="magnify"
            field="name"
            open-on-focus
            keep-first
            clear-on-select
            clearable
          >
            <template slot="header" v-if="create">
              <a @click="useData(newNavigation)">
                <span> Create a new one... </span>
              </a>
            </template>
            <template slot="empty"> No results for {{ search }}</template>
          </b-autocomplete>
        </b-field>
        <b-field label="Current Navigation" v-else>
          <b-input :value="selectedData.name" disabled />
        </b-field>
        <b-button
          v-if="selectedData"
          @click="useData(null)"
          icon-left="selection-off"
          type="is-primary"
          expanded
          label="Discard"
        />
      </div>
    </div>

    <div class="column" v-if="create">
      <div class="box">
        <b-field class="file" v-if="!selectedData">
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
              <p>Upload Navigation data</p>
            </div>
          </b-upload>
        </b-field>
        <b-button
          v-if="selectedData"
          @click="useData(cloneData(selectedData))"
          icon-left="plus-circle-multiple-outline"
          type="is-primary"
          expanded
          label="Clone Navigation"
        />
      </div>
    </div>
    <div class="column" v-if="selectedData && save">
      <div class="box buttons">
        <b-button
          @click="exportData"
          icon-left="download-outline"
          type="is-primary"
          expanded
          label="Download"
        />
        <b-field>
          <b-input
            v-model="selectedData.name"
            placeholder="Navigation name"
            :lazy="true"
            type="is-warning"
            required
            expanded
          />
          <p class="control">
            <b-button
              @click="saveData(selectedData)"
              icon-left="cloud-upload-outline"
              :type="
                selectedData && selectedData._id ? 'is-primary' : 'is-warning'
              "
              label="Save"
            />
          </p>
        </b-field>
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
import { DataManager } from "@/mixins/DataManager";
import { Navigation } from "@/models/Navigation";

export default {
  name: "NavigationManager",
  mixins: [DataManager],
  props: {
    select: Boolean,
    create: Boolean,
    save: Boolean
  },
  data() {
    return {
      dataType: "Navigation"
    };
  },
  pouch: {
    availableData() {
      return {
        database: "navue",
        selector: {
          type: this.dataType,
          name: { $regex: RegExp(this.search, "i") }
        }
      };
    }
  },
  computed: {
    selectedData: {
      get() {
        return this.$store.state.currentNavigation;
      },
      set(val) {
        this.$store.commit("currentNavigation", val);
      }
    },
    newNavigation() {
      return new Navigation();
    }
  }
};
</script>
