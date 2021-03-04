<template>
  <section>
    <b-table :data="value">
      <b-table-column label="Name" v-slot="props">
        <b-input v-model="props.row.name" />
      </b-table-column>
      <b-table-column label="Speed" v-slot="props">
        <b-field>
          <b-numberinput v-model="props.row.displayValue" :controls="false" />
          <b-select v-model="props.row.unit" required>
            <option
              v-for="(ratio, name) in props.row.constructor.units"
              :value="name"
              :key="name"
            >
              {{ name }}
            </option>
          </b-select>
        </b-field>
      </b-table-column>
      <b-table-column v-slot="props">
        <b-button
          @click="removeItem(props.row)"
          type="is-secondary"
          icon-right="close"
        />
      </b-table-column>
      <template #empty>
        Set cruise, climb, ... speeds to get ETA and ETE
      </template>
    </b-table>
    <b-button @click="addItem" type="is-primary">Add a pace</b-button>
  </section>
</template>

<style scoped lang="scss"></style>

<script>
import UnitSystem from "@/mixins/UnitSystem";
import { Speed } from "@/models/Quantities.js";

export default {
  name: "AircraftDetailPaces",
  props: ["value"],
  data() {
    return {
      checkedRows: []
    };
  },
  mixins: [UnitSystem],
  methods: {
    addItem() {
      this.value.push(new Speed(undefined, undefined, { name: undefined }));
    },
    removeItem(item) {
      this.value.splice(this.value.indexOf(item), 1);
    }
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
