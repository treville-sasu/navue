<template>
  <section>
    <b-button @click="value.unshift({ ...proto })" type="is-primary" rounded
      >Add a pace</b-button
    >
    <div class="control">
      <b-field
        v-for="(speed, index) in value"
        :key="index"
        horizontal
        group-multiline
      >
        <b-field label="Name" label-position="on-border" expanded>
          <b-input v-model="speed.name" />
        </b-field>
        <b-field label="Speed" label-position="on-border">
          <b-numberinput v-model="speed.value" :controls="false" :step="0.01" />
          <b-select placeholder="unit" v-model="speed.unit">
            <option
              v-for="(ratio, name) in units.speed"
              :value="name"
              :key="name"
              >{{ name }}</option
            >
          </b-select>
        </b-field>
        <b-button
          @click="value.splice(index, 1)"
          type="is-secondary"
          icon-right="close"
        />
      </b-field>
    </div>
  </section>
</template>

<style scoped lang="scss"></style>

<script>
import { UnitSystem } from "@/mixins/apputils";

export default {
  name: "AircraftDetailPaces",
  props: {
    value: {
      default() {
        return [
          {
            name: undefined,
            value: undefined,
            unit: "kt"
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
        unit: "kt"
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
