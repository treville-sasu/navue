<template>
  <b-modal
    v-bind="$attrs"
    aria-role="dialog"
    aria-modal
    trap-focus
    has-modal-card
    :active.sync="isModalActive"
  >
    <div class="modal-card">
      <div class="tile is-ancestor">
        <div class="tile is-parent is-6">
          <div class="tile is-child box">
            <b-field label="Choose a navigation">
              <b-autocomplete
                placeholder="LFxx > LFxx..."
                v-model="search"
                :data="navigations || []"
                @select="selectNavigation"
                icon="magnify"
                field="name"
                open-on-focus
                keep-first
                clear-on-select
                clearable
              >
                <template slot="empty">
                  No results for {{ search }} <br /><i
                    >Are you logged in ?</i
                  ></template
                >
              </b-autocomplete>
            </b-field>
          </div>
        </div>
        <div class="tile is-parent" v-if="!$attrs['can-cancel']">
          <div class="tile is-child box">
            <b-button
              @click="selectNavigation(value)"
              size="is-medium"
              icon-left="folder-plus"
              type="is-primary"
              expanded
              >Create Navigation</b-button
            >
          </div>
        </div>
        <div class="tile is-parent" v-else>
          <div class="tile is-child box">
            <b-field label="Save navigation">
              <b-input
                v-model="value.name"
                placeholder="Navigation name"
                :lazy="true"
                :type="!value.id ? 'is-warning' : ''"
                required
                expanded
              />
              <p class="control">
                <b-button
                  @click="saveNavigation(value)"
                  icon-left="cloud-upload-outline"
                  :type="!value.id ? 'is-warning' : 'is-primary'"
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
// TODO : add Start a new navigation (discard), delete a Navigation, Save as. (clone), enable Download and Upload
import { ImportExport } from "@/mixins/apputils";

export default {
  name: "NavigationSelect",
  mixins: [ImportExport],
  props: {
    value: {
      type: Object,
      default() {
        return { name: undefined, routes: [] };
      },
    },
    activate: Boolean,
  },
  data() {
    return {
      search: "",
      upload: [],
    };
  },
  mounted() {
    if (this.$store.state.currentNavigation)
      this.selectNavigation(this.$store.state.currentNavigation);
  },
  pouch: {
    navigations() {
      return {
        database: "navue",
        selector: {
          type: "navigation",
          name: { $regex: RegExp(this.search, "i") },
        },
        fields: ["name"],
      };
    },
  },
  methods: {
    selectNavigation(e) {
      this.$store.commit("currentNavigation", e);
      this.$emit("close");
      this.$emit("input", e);
    },
    importNavigation(file) {
      this.uploadJSON(file).then(this.selectNavigation);
    },
    exportNavigation() {
      this.downloadJSON(this.value, `${this.value.name}.json`);
    },
    saveNavigation(nav) {
      //TODO Allow for save as navigation & delete navigation
      this.$pouch
        .put({
          _id: `nav-${Date.now()}`,
          type: "navigation",
          ...nav,
        })
        .then((res) => {
          this.selectNavigation({
            type: "navigation",
            ...nav,
            ...res,
          });
        })
        .catch(console.error);
    },
  },
  computed: {
    isModalActive: {
      get() {
        return this.activate;
      },
      set() {
        this.$emit("close");
      },
    },
  },
};
</script>
