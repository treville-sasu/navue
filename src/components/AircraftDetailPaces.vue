<template>
  <section>
    <b-button @click="value.unshift({ ...proto })" type="is-primary" rounded
      >Add a pace</b-button
    >
    <div class="control">
      <!-- TODO : Make table of it -->
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
          <b-number-select
            :value.sync="speed.value"
            :quantity.sync="speed.unit"
            :options="quantity.speed"
            :controls="false"
          />
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
import UnitSystem from "@/mixins/UnitSystem";
import BNumberSelect from "./BNumberSelect.vue";

export default {
  components: { BNumberSelect },
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
