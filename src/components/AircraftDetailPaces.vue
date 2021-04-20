<template>
  <section>
    <b-table :data="value.items">
      <b-table-column label="Name" v-slot="props">
        <b-input v-model="props.row.name" />
      </b-table-column>
      <b-table-column label="Speed" v-slot="props">
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
import { Speed } from "@/models/Quantities.js";

export default {
  name: "AircraftDetailPaces",
  props: ["value"],
  data() {
    return {
      checkedRows: []
    };
  },
  methods: {
    addItem() {
      this.value.add(new Speed(undefined, undefined, { name: undefined }));
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
