<template>
  <section class="section">
    <b-button
      v-on:click="prependItem(paces, proto.paces[0])"
      type="is-primary"
      rounded
      >Add a pace</b-button
    >
    <div class="control">
      <b-field
        v-for="(speed, index) in paces"
        :key="index"
        horizontal
        group-multiline
      >
        <b-field label="Name" label-position="on-border" expanded>
          <b-input v-model="speed.name" />
        </b-field>
        <b-field label="Speed" label-position="on-border">
          <b-select placeholder="unit" v-model="speed.unit">
            <option
              v-for="(ratio, name) in units.speed"
              :value="name"
              :key="name"
              >{{ name }}</option
            >
          </b-select>
          <b-numberinput v-model="speed.value" :controls="false" :step="0.01" />
        </b-field>
        <b-button
          v-on:click="removeItem(paces, index)"
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
  name: "AircraftDetailPaces",
  props: ["paces"],
  mixins: [TypeCasting, UnitSystem]
};
</script>
