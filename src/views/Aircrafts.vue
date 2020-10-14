<template>
  <section class="section">
    <AircraftDetail
      v-if="aircraft"
      :aircraft="aircraft"
      @discard="aircraft = null"
    />
    <section v-else class="section">
      <div class="hero">
        <div class="hero-body">
          <div class="container">
            <h1 class="title">Choose, edit & manage your aircrafts</h1>
            <h2 class="subtitle">
              aircrafts are stored in browser and synced online.
            </h2>
          </div>
        </div>
      </div>
      <div class="tile is-ancestor">
        <div class="tile is-parent">
          <div class="tile is-child box">
            <AircraftSelect @select="routeAircraft" />
            <p class="block">
              Be sure to signup and login to operate synchronisation.
            </p>
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
              >Create a new Aircraft</b-button
            >
            <p class="block">
              This will create a local aircraft, which will be synchronised when
              logged in.
            </p>
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
import AircraftSelect from "@/components/AircraftSelect.vue";
import { ImportExport, TypeCasting } from "@/mixins/apputils";

export default {
  name: "Aircrafts",
  components: {
    AircraftDetail,
    AircraftSelect,
  },
  mixins: [ImportExport, TypeCasting],
  mounted() {
    if (this.$route.params.id)
      this.getAircraft(this.$route.params.id).catch(() => {
        this.$router.push({
          name: this.$route.name,
          params: {},
        });
      });
  },
  beforeRouteUpdate(to, from, next) {
    if (to.params.id)
      this.getAircraft(to.params.id).catch(() => {
        next({ ...to, params: {} });
      });
  },
  data() {
    return {
      aircraft: null,
      upload: [],
    };
  },
  methods: {
    newAircraft() {
      this.aircraft = { ...this.proto };
    },
    getAircraft(id) {
      return this.$pouch.get(id).then((doc) => {
        this.aircraft = doc;
      });
    },
    routeAircraft(aircraft) {
      this.$router.push({
        name: this.$route.name,
        params: { id: aircraft._id },
      });
    },
  },
};
</script>
