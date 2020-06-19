<template>
  <section class="section">
    <b-field group-multiline>
      <template slot="label">
        Fuel consumptions
        <b-tooltip type="is-dark" label="Add a fuel consumption rate">
          <b-button
            v-on:click="prependItem(consumptions, proto.consumptions[0])"
            type="is-secondary"
            icon-right="plus"
          />
        </b-tooltip>
      </template>
      <div class="control">
        <b-field v-for="(fuel, index) in consumptions" :key="index">
          <b-field label="Name" label-position="on-border">
            <b-input v-model="fuel.name" />
          </b-field>
          <b-field label="Fuel" label-position="on-border">
            <b-numberinput
              v-model="fuel.value"
              :controls="false"
              :step="0.01"
            />
            <b-select placeholder="unit" v-model="fuel.unit">
              <option
                v-for="option in units.fuel"
                :value="option"
                :key="option"
                >{{ option }}</option
              >
            </b-select>
            <p class="control">
              <b-button
                v-on:click="removeItem(consumptions, index)"
                type="is-secondary"
                icon-right="close"
              />
            </p>
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
  name: "AircraftDetailConsumptions",
  props: ["consumptions"],
  mixins: [editDetails]
};
</script>
