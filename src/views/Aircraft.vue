<template>
  <section class="section">
    <div class="columns">
      <div class="column is-narrow">
        <b-field label="Choose an Aircraft">
          <b-autocomplete
            v-model="search"
            placeholder="F-xxxx"
            :keep-first="true"
            :open-on-focus="true"
            :data="filteredDataObj"
            icon="magnify"
            field="id"
            @select="selectAircraft"
          >
            <template slot="footer">
              <a @click="createAircraft">
                <span>Add new Aircraft</span>
              </a>
            </template>
            <template slot="empty">No results for {{ search }}</template>
          </b-autocomplete>
        </b-field>
        <section>
          <b-button
            v-if="aircraft"
            @click="downloadJSON(aircraft, `${aircraft.id}.json`)"
            size="is-large"
            icon-left="download"
            type="is-primary"
            expanded
            outlined
            >Download aircraft data</b-button
          >
          <b-field class="file">
            <b-upload
              v-model="upload"
              accept="application/json"
              @input="uploadJSON"
              drag-drop
              expanded
            >
              <a class="button is-primary is-large is-fullwidth">
                <b-icon icon="upload"></b-icon>
                <span>Upload Aircraft data</span>
              </a>
            </b-upload>
          </b-field>
        </section>
      </div>
      <div class="column">
        <AircraftDetail v-if="aircraft" :aircraft="aircraft" />
        <section v-else class="hero is-success is-fullheight">
          <div class="hero-body">
            <div class="container">
              <h1 class="title">Choose, edit & manage your aircrafts</h1>
              <h2 class="subtitle">
                aircrafts are stored in browser and synced online
              </h2>
            </div>
          </div>
        </section>
      </div>
    </div>
  </section>
</template>

<script>
import AircraftDetail from "@/components/AircraftDetail.vue";
import { mapState } from "vuex";
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
      this.aircraft = option;
      this.search = "";
    },
    createAircraft() {
      this.aircraft = this.proto;
    },
    downloadJSON(data, fileName) {
      let fileToSave = new Blob([JSON.stringify(data, undefined, 2)], {
        type: "application/json",
        name: fileName
      });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(fileToSave);
      a.download = fileName;
      a.click();
    },
    uploadJSON(files) {
      files.forEach(file => {
        let fr = new FileReader();
        fr.onload = txt => {
          this.aircraft = JSON.parse(txt.target.result);
        };
        fr.readAsText(file);
      });
    }
  },
  computed: {
    filteredDataObj() {
      return this.aircrafts.filter(option => {
        return (
          option.id
            .toString()
            .toLowerCase()
            .indexOf(this.search.toLowerCase()) >= 0
        );
      });
    },
    ...mapState(["aircrafts"])
  }
};
</script>
