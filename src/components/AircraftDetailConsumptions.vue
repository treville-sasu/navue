<template>
  <section class="section">
    <b-button
      @click="prependItem(consumptions, proto.consumptions[0])"
      type="is-primary"
      rounded
      >Add a consumption rate</b-button
    >
    <div class="control">
      <b-field
        v-for="(consumption, index) in consumptions"
        :key="index"
        horizontal
      >
        <b-field label="Name" label-position="on-border" expanded>
          <b-input v-model="consumption.name" />
        </b-field>
        <b-field label="Fuel" label-position="on-border">
          <b-select placeholder="vol." v-model="consumption.volume">
            <option
              v-for="(ratio, name) in units.volume"
              :value="name"
              :key="name"
              >{{ name }}</option
            >
          </b-select>
          <b-select placeholder="cons." v-model="consumption.unit">
            <option
              v-for="option in units.consumptions"
              :value="option"
              :key="option"
              >{{ option }}</option
            >
          </b-select>
          <b-numberinput
            v-model="consumption.value"
            :controls="false"
            :step="0.01"
          />
        </b-field>
        <b-button
          @click="removeItem(consumptions, index)"
          type="is-secondary"
          icon-right="close"
        />
      </b-field>
    </div>
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
