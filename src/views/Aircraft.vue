<template>
  <section class="container">
    <AircraftDetail
      v-if="aircraft"
      :aircraft="aircraft"
      v-on:discard="aircraft = null"
      v-on:aircraftUpdated="aircraft = null"
    />
    <section v-else class="section">
      <div class="hero">
        <div class="hero-body">
          <div class="container">
            <h1 class="title">Choose, edit & manage your aircrafts</h1>
            <h2 class="subtitle">aircrafts are stored in browser and synced online</h2>
          </div>
        </div>
      </div>
      <div class="tile is-ancestor">
        <div class="tile is-parent">
          <div class="tile is-child box">
            <b-field label="Choose an Aircraft">
              <b-autocomplete
                placeholder="F-xxxx"
                v-model="search"
                :data="aircrafts"
                @select="selectAircraft"
                icon="magnify"
                field="registration"
                open-on-focus
                keep-first
                clear-on-select
                clearable
              >
                <template slot="empty">No results for {{ search }}</template>
              </b-autocomplete>
            </b-field>
          </div>
        </div>
        <div class="tile is-parent">
          <div class="tile is-child box">
            <b-button
              @click="newAircraft"
              size="is-large"
              icon-left="folder-plus"
              type="is-primary"
              expanded
            >Create a new Aircraft</b-button>
          </div>
        </div>
        <div class="tile is-parent">
          <div class="tile is-child box">
            <b-field class="file">
              <b-upload
                v-model="upload"
                accept="application/json"
                @input="uploadJSON"
                drag-drop
                expanded
              >
                <section class="section">
                  <div class="content has-text-centered">
                    <p>
                      <b-icon icon="upload" size="is-large"></b-icon>
                    </p>
                    <p>Upload Aircraft data</p>
                  </div>
                </section>
              </b-upload>
            </b-field>
          </div>
        </div>
      </div>
    </section>
  </section>
</template>

<script>
import AircraftDetail from "@/components/AircraftDetail.vue";
import { mapState, mapGetters } from "vuex";
import { editDetails } from "@/mixins/casting";

export default {
  name: "Aircraft",
  components: {
    AircraftDetail
  },
  mixins: [editDetails],
  data() {
    return {
      aircraft: null,
      search: "",
      upload: []
    };
  },
  methods: {
    selectAircraft(option) {
      this.aircraft = { ...option };
    },
    newAircraft() {
      this.aircraft = { ...this.proto };
    }
  },
  computed: {
    aircraftFilteredList() {
      return this.searchAircraft(this.search);
    },
    ...mapState(["selectedAircraft"]), //, "aircrafts"
    ...mapGetters(["searchAircraft"])
  },
  pouch: {
    aircrafts() {
      return {
        database: "navue",
        selector: { registration: { $regex: RegExp(this.search, "i") } },
        fields: ["registration"]
      };
    }
  }
};
</script>
