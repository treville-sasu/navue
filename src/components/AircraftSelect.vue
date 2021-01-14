<template>
  <div class="columns is-multiline is-centered">
    <div class="column" v-if="select">
      <div class="box">
        <b-field label="Choose an aircraft">
          <b-autocomplete
            placeholder="F-Pxx, Nxxx"
            v-model="search"
            :data="aircrafts || []"
            @select="useData"
            icon="magnify"
            field="registration"
            open-on-focus
            keep-first
            clear-on-select
            clearable
          >
            <template slot="header" v-if="create">
              <a @click="useData({})">
                <span> Create a new one... </span>
              </a>
            </template>
            <template slot="empty"> No results for {{ search }}</template>
          </b-autocomplete>
        </b-field>
        <b-button
          v-if="aircraft"
          @click="aircraft = null"
          icon-left="selection-off"
          type="is-primary"
          expanded
          label="Unselect"
        />
      </div>
    </div>
    <div class="column" v-if="isSaved && create">
      <div class="box">
        <b-field class="file">
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
          @click="useData(cloneData(aircraft))"
          icon-left="plus-circle-multiple-outline"
          type="is-primary"
          expanded
          label="Clone aircraft"
        />
      </div>
    </div>
    <div class="column" v-if="aircraft">
      <div class="box buttons">
        <b-button
          v-if="$route.name != 'Aircraft'"
          tag="router-link"
          :to="{
            name: 'Aircraft'
          }"
          icon-left="circle-edit-outline"
          type="is-primary"
          expanded
          label="Modify"
        />
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
          @click="discardData"
          icon-left="cloud-upload-outline"
          type="is-info"
          expanded
          label="Discard"
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
          v-if="isSaved && aircraft.gotId"
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
<style scoped>
.modal .animation-content .modal-card {
  overflow: visible !important;
}

.modal-card-body {
  overflow: visible !important;
}
</style>
<script>
// import { DataSelect } from "@/mixins/DataSelect";
import deepEqual from "deep-equal";
import { ImportExport } from "@/mixins/apputils";
import { UIHelpers } from "@/mixins/apputils";

export default {
  name: "AircraftSelect",
  // mixins: [DataSelect],
  mixins: [ImportExport, UIHelpers],
  props: {
    unsavedAircaft: Object,
    select: Boolean,
    create: Boolean,
    save: Boolean
  },
  data() {
    return {
      search: "",
      upload: []
    };
  },
  pouch: {
    aircrafts() {
      return {
        database: "navue",
        selector: {
          type: this.dataType,
          registration: { $regex: RegExp(this.search, "i") }
        }
      };
    }
  },

  computed: {
    aircraft: {
      get() {
        return this.$store.state.currentAircraft;
      },
      set(val) {
        this.$emit("update:aircraft", val);
        this.$store.commit("currentAircraft", val);
      }
    },
    isSaved() {
      return (
        !this.unsavedAircaft || deepEqual(this.aircraft, this.unsavedAircaft)
      );
    }
  },
  methods: {
    useData(data) {
      this.aircraft = data;
      this.$emit("update:aircraft", this.aircraft);
    },
    discardData() {
      this.useData(this.aircraft);
    },
    saveData() {
      this.$store
        .dispatch("saveToDB", {
          _id: `aircraft-${Date.now()}`,
          ...this.unsavedAircaft
        })
        .then(res => {
          this.useData({ ...this.unsavedAircaft, _id: res.id, _rev: res.rev });
          this.openWarning("Aircraft Saved");
        })
        .catch(err => {
          this.openWarning(err);
        });
    },
    deleteData() {
      this.$store
        .dispatch("deleteFromDB", this.aircraft)
        .then(() => {
          this.useData(null);
          this.openWarning("Aircraft deleted");
        })
        .catch(err => {
          this.openWarning(err);
        });
    },
    importData(file) {
      this.uploadJSON(file).then(res => {
        this.useData(this.cloneData(res));
      });
    },
    exportData() {
      if (this.value) this.downloadJSON(this.value, `${this.value.name}.json`);
    },
    cloneData(data) {
      const { _id, _rev, ...clone } = data; // eslint-disable-line no-unused-vars
      return clone;
    }
  }
};
</script>
