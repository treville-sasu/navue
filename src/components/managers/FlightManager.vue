<template>
  <b-dropdown v-bind="$attrs">
    <template #trigger>
      <slot name="default" :selected="selectedData">
        <b-button>
          <b-tooltip
            position="is-bottom"
            :label="selectedData ? selectedData.name || 'new' : 'Flight'"
          >
            <b-icon
              icon="go-kart-track"
              :type="selectedData ? 'is-success' : ''"
            />
          </b-tooltip>
        </b-button>
      </slot>
    </template>

    <template v-if="selectedData">
      <b-dropdown-item custom>
        <slot name="header" :selected="selectedData">
          <b-input v-model="selectedData.name" placeholder="Flight n°" />
        </slot>
      </b-dropdown-item>
      <b-dropdown-item separator />
      <template v-if="create">
        <b-dropdown-item @click="buildFromLocal">
          <b-icon icon="cloud-upload-outline" type="is-warning" />
          Save
        </b-dropdown-item>
      </template>
      <template v-else-if="edit">
        <b-dropdown-item @click="saveData">
          <b-icon icon="cloud-upload-outline" type="is-warning" />
          Save
        </b-dropdown-item>

        <b-dropdown-item @click="exportData">
          <b-icon icon="download-outline" />
          Export
        </b-dropdown-item>

        <b-dropdown-item @click="deleteData" :disabled="!fromDB">
          <b-icon icon="delete-outline" type="is-danger" />
          Delete
        </b-dropdown-item>
      </template>
      <b-dropdown-item @click="discardData">
        <b-icon icon="selection-off" />
        Discard
      </b-dropdown-item>
    </template>

    <template v-else>
      <b-dropdown-item custom>
        <b-autocomplete
          v-model="search"
          placeholder="Open Flight"
          :data="availableData || []"
          :field="searchedProperty"
          open-on-focus
          keep-first
          clear-on-select
          clearable
          @select="
            (data, e) => {
              e.stopPropagation();
              this.selectedData = data;
            }
          "
        >
          <template #header v-if="create">
            <a @click="selectedData = new constructor({ name: search })">
              <span> Create {{ search }}</span>
            </a>
          </template>
          <template #footer v-if="edit">
            <b-field class="file is-primary">
              <b-upload
                v-model="upload"
                class="file-label"
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
          <template #empty v-if="!edit && search">
            <i>{{ search }}</i> not found
          </template>
          <template #empty v-else> No Flight recorded </template>
        </b-autocomplete>
      </b-dropdown-item>
    </template>

    <b-dropdown-item separator />
    <b-dropdown-item :disabled="!trace" @click="deleteLocations">
      <b-icon icon="map-marker-remove-outline" type="is-danger" />Delete trace
    </b-dropdown-item>
  </b-dropdown>
</template>

<script>
import { DataManager } from "@/mixins/DataManager";
import { Flight } from "@/models/Flight";

export default {
  name: "FlightManager",
  mixins: [DataManager],
  props: {
    trace: String,
  },
  data() {
    return {
      constructor: Flight,
      storeKey: "currentFlight",
      searchedProperty: "properties.name",
    };
  },
  methods: {
    async buildFromLocal() {
      return await this.importLocations()
        .then(this.saveData)
        .then(this.deleteLocations);
    },
    async importLocations() {
      let traces = await this.$pouch[this.trace]
        .query(
          {
            // eslint-disable-next-line no-unused-vars
            map: ({ _id, _rev, ...location }, emit) => {
              if (location.type == "Location")
                emit(_id.split("-")[0], location);
            },
            reduce: (_, values) => values,
          },
          { group: true }
        )
        .then(({ rows }) => {
          return rows.map(({ key, value }) => {
            this.selectedData
              .addBranch(value, { startedAt: Number(key) })
              .last();
          });
        });

      return traces.length > 0;
    },
    async deleteLocations() {
      await this.$pouch[this.trace].viewCleanup();
      return await this.$pouch[this.trace].destroy();
    },
  },
};
</script>
