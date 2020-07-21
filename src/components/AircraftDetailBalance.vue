<template>
  <section class="section">
    <b-field label="Balanced on">
      <b-datepicker
        v-model="curatedDate"
        placeholder="Select last balance sheet date"
        trap-focus
        icon="calendar-today"
      />
    </b-field>
    <b-button
      @click="prependItem(balance.weights, proto.balance.weights[0])"
      type="is-primary"
      rounded
      >Add a mass</b-button
    >
    <div class="control">
      <b-field
        v-for="(weight, index) in balance.weights"
        :key="index"
        horizontal
      >
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
          @click="removeItem(balance.weights, index)"
          type="is-secondary"
          icon-right="close"
        />
      </b-field>
    </div>
  </section>
</template>

<style scoped lang="scss"></style>

<script>
import { TypeCasting } from "@/mixins/apputils";

export default {
  name: "AircraftDetailBalance",
  mixins: [TypeCasting],
  props: ["balance"],
  computed: {
    curatedDate: {
      get() {
        return this.balance.date
          ? new Date(this.balance.date)
          : this.balance.date;
      },
      set(value) {
        this.balance.date = value;
      }
    }
  }
};
</script>
