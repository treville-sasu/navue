<template>
  <!-- 27afc073-f712-4370-b7ac-2392f90b3e8d
24d8aef5-17d8-4ae0-a5e8-a051ae14b5d4
b727bb52-982e-4a8a-afe5-7be388de1a68
F-GNHZ1601992403575 -->
  <b-modal
    v-model="isOpen"
    @after-leave="$emit('close')"
    v-bind="$attrs"
    has-modal-card
    aria-role="dialog"
    aria-modal
    destroy-on-hide
    trap-focus
  >
    <div class="modal-card">
      <div class="tile is-ancestor">
        <div class="tile is-parent">
          <div class="tile is-child box">
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
                <template slot="header" v-if="editable">
                  <a @click="useData(proto)">
                    <span> Create a new one... </span>
                  </a>
                </template>
                <template slot="empty"> No results for {{ search }}</template>
              </b-autocomplete>
            </b-field>
          </div>
        </div>

        <div class="tile is-parent" v-if="editable">
          <div class="tile is-child box">
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
          </div>
        </div>
      </div>
      <div class="tile is-ancestor">
        <div class="tile is-parent" v-if="value">
          <div class="tile is-child box buttons">
            <b-button
              tag="router-link"
              :to="{ name: 'Aircraft' }"
              icon-left="folder-plus"
              type="is-primary"
              expanded
              label="Edit"
            />
            <b-button
              @click="exportData"
              icon-left="download-outline"
              type="is-primary"
              expanded
              label="Download"
            />
          </div>
        </div>
        <div class="tile is-parent" v-if="value">
          <div class="tile is-child box buttons" v-if="editable">
            <b-button
              @click="saveData(value)"
              icon-left="cloud-upload-outline"
              :type="value && value._id ? 'is-primary' : 'is-warning'"
              expanded
              label="Save"
            />
            <b-button
              v-if="isFromDB"
              @click="useData(cloneData(value))"
              icon-left="plus-circle-multiple-outline"
              type="is-primary"
              expanded
              label="Clone"
            />
            <b-button
              v-if="isFromDB"
              @click="deleteData"
              icon-left="delete-outline"
              type="is-danger"
              expanded
              label="Delete"
            />
          </div>
        </div>
      </div>
    </div>
  </b-modal>
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
import { DataSelect } from "@/mixins/DataSelect";

export default {
  name: "AircraftSelect",
  mixins: [DataSelect],
  data() {
    return {
      dataType: "aircraft",
      proto: {
        type: "aircraft",
        registration: undefined,
        manufacturer: undefined,
        model: undefined,
        paces: undefined,
        balance: undefined,
        envelopes: undefined,
        consumptions: undefined,
        checklists: undefined,
      },
    };
  },
  created() {
    this.$root.$on("aircraft-select", (e) => {
      switch (e) {
        case "save":
          this.saveData(this.value);
          break;
        case "delete":
          this.deleteData(this.value);
          break;
        default:
          this.activated = true;
      }
    });
  },
  pouch: {
    aircrafts() {
      return {
        database: "navue",
        selector: {
          type: this.dataType,
          registration: { $regex: RegExp(this.search, "i") },
        },
      };
    },
  },

  computed: {
    selectedData: {
      get() {
        return this.$store.state.currentAircraft;
      },
      set(val) {
        this.$store.commit("currentAircraft", val);
      },
    },
    activated: {
      get() {
        return this.$store.state.aircraftSelect;
      },
      set(val) {
        this.$store.commit("aircraftSelect", val);
      },
    },
  },
};
</script>
