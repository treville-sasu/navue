<template>
  <section class="section">
    <b-field custom-class="is-large">
      <b-input
        v-if="editEnabled"
        v-model="aircraft.id"
        placeholder="Registration number"
      />
      <h2 v-else class="title is-2">{{ aircraft.id }}</h2>

      <b-switch v-model="editEnabled" type="is-warning">Edit</b-switch>
      <b-button
        v-if="editEnabled"
        type="is-danger"
        icon-left="delete"
        @click="deleteAircraft(aircraft)"
        >Delete</b-button
      >
      <b-button
        v-if="editEnabled"
        type="is-primary"
        icon-left="save"
        @click="updateAircraft(aircraft)"
        >Save</b-button
      >
    </b-field>

    <b-tabs position="is-centered" multiline expanded>
      <b-tab-item label="Paces">
        <AircraftDetailPaces :paces="aircraft.paces" />
      </b-tab-item>
      <b-tab-item label="Fuel">
        <AircraftDetailConsumptions :consumptions="aircraft.consumptions" />
      </b-tab-item>
      <b-tab-item label="Balance & Weight">
        <AircraftDetailBalance :balance="aircraft.balance" />
      </b-tab-item>
      <b-tab-item label="Envelopes">
        <AircraftDetailEnvelopes :envelopes="aircraft.envelopes" />
      </b-tab-item>
    </b-tabs>
  </section>
</template>

<style scoped lang="scss"></style>

<script>
import AircraftDetailPaces from "@/components/AircraftDetailPaces.vue";
import AircraftDetailBalance from "@/components/AircraftDetailBalance.vue";
import AircraftDetailEnvelopes from "@/components/AircraftDetailEnvelopes.vue";
import AircraftDetailConsumptions from "@/components/AircraftDetailConsumptions.vue";

export default {
  name: "AircraftDetail",
  props: ["aircraft"],
  data() {
    return {
      editEnabled: false
    };
  },
  components: {
    AircraftDetailPaces,
    AircraftDetailBalance,
    AircraftDetailEnvelopes,
    AircraftDetailConsumptions
  }
};
</script>
