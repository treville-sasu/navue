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
        <b-field v-for="(consumption, index) in consumptions" :key="index" grouped>
          <b-field label="Name" label-position="on-border" expanded>
            <b-input v-model="consumption.name" />
          </b-field>
          <b-field label="Fuel" label-position="on-border">
            <b-select placeholder="vol." v-model="consumption.volume">
              <option v-for="(ratio, name) in units.volume" :value="name" :key="name">{{ name }}</option>
            </b-select>
            <b-select placeholder="cons." v-model="consumption.unit">
              <option
                v-for="option in units.consumptions"
                :value="option"
                :key="option"
              >{{ option }}</option>
            </b-select>
            <b-numberinput v-model="consumption.value" :controls="false" :step="0.01" />
          </b-field>
          <b-button
            v-on:click="removeItem(consumptions, index)"
            type="is-secondary"
            icon-right="close"
          />
        </b-field>
      </div>
    </b-field>
  </section>
</template>

<style scoped lang="scss"></style>

<script>
import { TypeCasting, UnitSystem } from "@/mixins/apputils";

export default {
  name: "AircraftDetailConsumptions",
  props: ["consumptions"],
  mixins: [TypeCasting, UnitSystem]
};
</script>
