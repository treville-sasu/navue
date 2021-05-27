<template>
  <div class="card">
    <header class="card-header">
      <p class="card-header-title">
        <b-field grouped>
          <b-input v-model="value.name" placeholder="echo" expanded />
          <b-altitude
            v-model="value.altitude"
            placeholder="alt."
            :controls="false"
          />
        </b-field>
      </p>
    </header>
    <div class="card-content">
      <b-notepad v-model="value.notes" :rows="2" />
    </div>
    <footer class="card-footer">
      <b-field position="is-centered">
        <b-input
          :value="value.point.toString()"
          icon="crosshairs-gps"
          readonly
        />
        <p class="control">
          <span class="button is-static">WGS84</span>
        </p>
      </b-field>
    </footer>
  </div>
</template>

<script>
import BAltitude from "./buefy/BAltitude.vue";
import BNotepad from "@/components/buefy/BNotepad";

export default {
  components: { BAltitude, BNotepad },
  name: "WaypointContent",
  props: {
    value: Object
  }
};
</script>
