<template>
  <fieldset>
    <b-field grouped>
      <b-field label="Name" label-position="on-border" expanded>
        <b-input v-model="value.name" placeholder="echo" />
      </b-field>

      <b-field label="Alt." label-position="on-border">
        <b-altitude v-model="value.altitude" :controls="false" />
      </b-field>
    </b-field>

    <b-field label="Notes" label-position="on-border" expanded>
      <b-input v-model="value.notes" maxlength="200" type="textarea"></b-input>
    </b-field>
  </fieldset>
</template>

<script>
import UnitSystem from "@/mixins/UnitSystem.js";
import { Altitude } from "@/models/Quantities.js";
import BAltitude from "./BAltitude.vue";

export default {
  components: { BAltitude },
  name: "WaypointContent",
  mixins: [UnitSystem],
  props: {
    value: Object
  },
  computed: {
    altitude() {
      return this.value.altitude || new Altitude();
    }
  }
};
</script>
