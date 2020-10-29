<template>
  <b-modal
    v-model="openModal"
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
            <b-field label="Choose a navigation">
              <b-autocomplete
                placeholder="LFxx > LFxx..."
                v-model="search"
                :data="navigations || []"
                @select="useData"
                icon="magnify"
                field="name"
                open-on-focus
                keep-first
                clear-on-select
                clearable
              >
                <template slot="header">
                  <a @click="useData(undefined)">
                    <span> Create a new one... </span>
                  </a>
                </template>
                <template slot="empty"> No results for {{ search }}</template>
              </b-autocomplete>
            </b-field>
          </div>
        </div>

        <div class="tile is-parent">
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
                  <p>Upload Navigation data</p>
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
              :to="{ name: 'Route' }"
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
          <div class="tile is-child box buttons">
            <b-button
              v-if="isFromDB"
              @click="useData({ ...value, _id: undefined, _rev: undefined })"
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
            <b-field label="Save navigation">
              <b-input
                v-model="value.name"
                placeholder="Navigation name"
                :lazy="true"
                :type="value && value._id ? 'is-primary' : 'is-warning'"
                required
                expanded
              />
              <p class="control">
                <b-button
                  @click="saveData(value)"
                  icon-left="cloud-upload-outline"
                  :type="value && value._id ? 'is-primary' : 'is-warning'"
                />
              </p>
            </b-field>
          </div>
        </div>
        <!-- <div class="tile is-parent">
          <div class="tile is-child box">
            <b-field class="file">
              <b-upload
                v-model="upload"
                accept="application/json"
                @input="importNavigation"
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
          </div>
        </div> -->
        <!-- <div class="tile is-parent" v-if="!$attrs['can-cancel']">
          <div class="tile is-child box">
            <b-button
              @click="exportNavigation"
              size="is-medium"
              icon-left="download-outline"
              type="is-primary"
              expanded
              >Download Navigation</b-button
            >
          </div>
        </div> -->
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
  name: "NavigationSelect",
  mixins: [DataSelect],
  props: {
    value: {
      type: Object,
      default() {
        return { name: undefined, routes: [] };
      },
    },
  },
  data() {
    return {
      dataType: "navigation",
    };
  },
  pouch: {
    navigations() {
      return {
        database: "navue",
        selector: {
          type: this.dataType,
          name: { $regex: RegExp(this.search, "i") },
        },
      };
    },
  },

  computed: {
    selectedData: {
      get() {
        return this.$store.state.currentNavigation;
      },
      set(val) {
        this.$store.commit("currentNavigation", val);
      },
    },
    activated: {
      get() {
        return this.$store.state.navigationSelect;
      },
      set(val) {
        this.$store.commit("navigationSelect", val);
      },
    },
  },
};
</script>
