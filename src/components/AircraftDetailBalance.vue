<template>
  <section>
    <b-field label="Balanced on">
      <b-datepicker
        v-model="curatedDate"
        placeholder="Select last value sheet date"
        trap-focus
        icon="calendar-today"
      />
    </b-field>
    <b-button
      @click="value.weights.unshift({ ...proto })"
      type="is-primary"
      rounded
      >Add a mass</b-button
    >
    <div class="control">
      <b-field v-for="(weight, index) in value.weights" :key="index" horizontal>
        <b-field label="Name" label-position="on-border">
          <b-input v-model="weight.name" />
        </b-field>
        <b-field label="Arm" label-position="on-border">
          <b-numberinput
            v-model="weight.arm"
            :controls="false"
            :step="0.001"
            expanded
          />
        </b-field>
        <b-field label="Minimum" label-position="on-border">
          <b-numberinput
            v-model="weight.min"
            :controls="false"
            :step="0.1"
            expanded
          />
        </b-field>
        <b-field label="Maximum" label-position="on-border">
          <b-numberinput
            v-model="weight.max"
            :controls="false"
            :step="0.1"
            expanded
          />
        </b-field>
        <b-field label="Weight" label-position="on-border">
          <b-numberinput
            v-model="weight.value"
            :controls="false"
            :step="0.1"
            expanded
          />
        </b-field>
        <b-field label="Density" label-position="on-border">
          <b-numberinput
            v-model="weight.density"
            :controls="false"
            :step="0.001"
            expanded
          />
        </b-field>
        <b-field>
          <b-checkbox-button
            v-model="weight.tank"
            :native-value="true"
            type="is-primary"
            >Tank</b-checkbox-button
          >
        </b-field>
        <b-button
          @click="value.weights.splice(index, 1)"
          type="is-secondary"
          icon-right="close"
        />
      </b-field>
    </div>
  </section>
</template>

<style scoped lang="scss"></style>

<script>
export default {
  name: "AircraftDetailBalance",
  props: {
    value: {
      default() {
        return {
          date: undefined,
          weights: [
            {
              name: undefined,
              arm: undefined,
              value: undefined,
              density: 1,
              min: undefined,
              max: undefined,
              tank: false,
            },
          ],
        };
      },
    },
  },
  data() {
    return {
      proto: {
        name: undefined,
        arm: undefined,
        value: undefined,
        density: 1,
        min: undefined,
        max: undefined,
        tank: false,
      },
    };
  },
  watch: {
    value: {
      deep: true,
      handler(oldVal, newVal) {
        this.$emit("input", newVal);
      },
    },
  },
  computed: {
    // TODO: check if still needed with buefy 0.9.3
    curatedDate: {
      get() {
        return this.value.date ? new Date(this.value.date) : this.value.date;
      },
      set(value) {
        this.value.date = value;
      },
    },
  },
};
</script>
