<template>
  <section class="section">
    <b-field group-multiline>
      <template slot="label">
        Paces
        <b-tooltip type="is-dark" label="Add a pace">
          <b-button
            v-on:click="prependItem(paces, proto.paces[0])"
            type="is-secondary"
            icon-right="plus"
          />
        </b-tooltip>
      </template>
      <div class="control">
        <b-field v-for="(speed, index) in paces" :key="index">
          <b-field label="Name" label-position="on-border">
            <b-input v-model="speed.name" />
          </b-field>
          <b-field label="Speed" label-position="on-border">
            <b-numberinput
              v-model="speed.value"
              :controls="false"
              :step="0.01"
            />
            <b-select placeholder="unit" v-model="units.speed">
              <option
                v-for="option in units.speed"
                :value="option"
                :key="option"
                >{{ option }}</option
              >
            </b-select>
            <p class="control">
              <b-button
                v-on:click="removeItem(paces, index)"
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
  name: "AircraftDetailPaces",
  props: ["paces"],
  mixins: [editDetails]
};
</script>
