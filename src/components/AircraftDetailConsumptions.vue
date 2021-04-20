<template>
  <section>
    <b-table :data="value.items">
      <b-table-column label="Name" v-slot="props">
        <b-input v-model="props.row.name" />
      </b-table-column>
      <b-table-column label="Value" v-slot="props">
        <b-field>
          <b-numberinput v-model="props.row.value" :controls="false" />
          <b-select v-model="props.row.unit" required>
            <option
              v-for="(ratio, name) in props.row.constructor.units"
              :value="name"
              :key="name"
            >
              {{ name }}
            </option>
          </b-select>
          <p class="control">
            <span class="button is-static">/</span>
          </p>
          <b-select v-model="props.row.reference" required>
            <option
              v-for="ref in props.row.constructor.references"
              :value="ref"
              :key="ref"
            >
              {{ ref }}
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
        Add fuel consumption values to allow fuel supply calculation.
      </template>
    </b-table>
    <b-button @click="addItem" type="is-primary"
      >Add a consumption rate</b-button
    >
  </section>
</template>

<script>
import { Consumption } from "@/models/Quantities.js";

export default {
  name: "AircraftDetailConsumptions",
  props: ["value"],
  methods: {
    addItem() {
      this.value.add(
        new Consumption(undefined, undefined, undefined, { name: undefined })
      );
    },
    removeItem(item) {
      this.value.remove(item);
    }
  },
  watch: {
    value: {
      deep: true,
      handler(val) {
        this.$emit("input", val);
      }
    }
  }
};
</script>
