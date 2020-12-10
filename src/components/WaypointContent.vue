<template>
  <fieldset>
    <b-field grouped>
      <b-field label="Position" label-position="on-border" expanded>
        <b-input v-model="value.position" placeholder="echo" />
      </b-field>

      <b-field label="Alt." label-position="on-border">
        <b-number-select
          :value.sync="value.altitude.value"
          :quantity.sync="value.altitude.unit"
          :options="quantity.altitude"
          :controls="false"
        />
      </b-field>
      <b-select
        v-model="value.altitude.reference"
        :disabled="value.altitude.unit === 'FL'"
      >
        <option v-for="ref in quantity.references" :value="ref" :key="ref">{{
          ref
        }}</option>
      </b-select>
    </b-field>

    <b-field label="Notes" label-position="on-border" expanded>
      <b-input v-model="value.notes" maxlength="200" type="textarea"></b-input>
    </b-field>
  </fieldset>
</template>

<script>
import UnitSystem from "@/mixins/UnitSystem.js";
import BNumberSelect from "./BNumberSelect.vue";

export default {
  name: "WaypointContent",
  components: { BNumberSelect },
  mixins: [UnitSystem],
  props: {
    value: Object
  }
};
</script>
