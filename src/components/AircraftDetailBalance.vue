<template>
  <section class="section">
    <b-field label="Balanced on">
      <b-datepicker
        v-model="balance.date"
        placeholder="Select last balance sheet date"
        trap-focus
        icon="calendar-today"
      />
    </b-field>
    <b-field group-multiline>
      <template slot="label">
        Weights
        <b-tooltip type="is-dark" label="Add a weight">
          <b-button
            v-on:click="prependItem(balance.weights, proto.balance.weights[0])"
            type="is-secondary"
            icon-right="plus"
          />
        </b-tooltip>
      </template>
      <div class="control">
        <b-field v-for="(weight, index) in balance.weights" :key="index">
          <p class="control">
            <b-button
              v-on:click="removeItem(balance.weights, index)"
              type="is-secondary"
              icon-right="close"
            />
          </p>
          <b-field label="Name" label-position="on-border">
            <b-input v-model="weight.name" />
          </b-field>
          <b-field label="Arm" label-position="on-border">
            <b-numberinput v-model="weight.arm" :controls="false" :step="0.001" />
          </b-field>
          <b-field label="Minimum" label-position="on-border">
            <b-numberinput v-model="weight.min" :controls="false" :step="0.1" />
          </b-field>
          <b-field label="Maximum" label-position="on-border">
            <b-numberinput v-model="weight.max" :controls="false" :step="0.1" />
          </b-field>
          <b-field label="Weight" label-position="on-border">
            <b-numberinput v-model="weight.value" :controls="false" :step="0.1" />
          </b-field>
          <b-field label="Density" label-position="on-border">
            <b-numberinput v-model="weight.density" :controls="false" :step="0.001" />
          </b-field>
        </b-field>
      </div>
    </b-field>
  </section>
</template>

<style scoped lang="scss"></style>

<script>
import { editDetails } from "@/mixins/casting";

export default {
  name: "AircraftDetailBalance",
  mixins: [editDetails],
  props: ["balance"]
};
</script>
