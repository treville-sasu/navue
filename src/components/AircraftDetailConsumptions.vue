<template>
  <section>
    <b-button @click="value.unshift({ ...proto })" type="is-primary" rounded
      >Add a consumption rate</b-button
    >
    <div class="control">
      <b-field v-for="(consumption, index) in value" :key="index" horizontal>
        <b-field label="Name" label-position="on-border" expanded>
          <b-input v-model="consumption.name" />
        </b-field>
        <b-field label="Fuel" label-position="on-border">
          <b-number-select
            :value.sync="consumption.value"
            :quantity.sync="consumption.unit"
            :options="quantities.volume"
            :controls="false"
          />
        </b-field>
        <b-select placeholder="cons." v-model="consumption.part">
          <option
            v-for="option in quantities.consumptions"
            :value="option"
            :key="option"
            >{{ option }}</option
          >
        </b-select>
        <b-button
          @click="value.splice(index, 1)"
          type="is-secondary"
          icon-right="close"
        />
      </b-field>
    </div>
  </section>
</template>

<script>
import UnitSystem from "@/mixins/UnitSystem";
import BNumberSelect from "./BNumberSelect.vue";

export default {
  name: "AircraftDetailConsumptions",
  components: { BNumberSelect },
  props: {
    value: {
      default() {
        return [
          {
            name: undefined,
            value: undefined,
            volume: "L",
            unit: undefined
          }
        ];
      }
    }
  },
  mixins: [UnitSystem],
  data() {
    return {
      proto: {
        name: undefined,
        value: undefined,
        volume: "L",
        unit: undefined
      }
    };
  },
  watch: {
    value: {
      deep: true,
      handler(oldVal, newVal) {
        this.$emit("input", newVal);
      }
    }
  }
};
</script>
