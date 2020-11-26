<template>
  <fieldset>
    <b-field grouped>
      <b-field label="Position" label-position="on-border" expanded>
        <b-input v-model="value.position" placeholder="echo" />
      </b-field>

      <b-field label="Alt." label-position="on-border" expanded>
        <b-numberinput
          v-model="value.altitude.value"
          :controls="false"
          :step="1"
          placeholder="how high ?"
          expanded
        />
        <b-select placeholder="unit" v-model="value.altitude.unit">
          <option
            v-for="(ratio, name) in units.altitude"
            :value="name"
            :key="name"
            >{{ name }}</option
          >
        </b-select>
      </b-field>
    </b-field>

    <b-field label="Notes" label-position="on-border" expanded>
      <b-input v-model="value.notes" maxlength="200" type="textarea"></b-input>
    </b-field>
  </fieldset>
</template>

<script>
import { UnitSystem } from "@/mixins/apputils";

export default {
  name: "WaypointContent",
  mixins: [UnitSystem],
  props: {
    value: Object
  }
};
</script>
