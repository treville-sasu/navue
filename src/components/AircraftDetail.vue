<template>
  <b-tabs position="is-centered" multiline expanded>
    <b-tab-item label="Identification">
      <b-field label="Registration" horizontal>
        <b-input v-model="value.registration" placeholder="F-...." required />
      </b-field>
      <b-field label="Manufacturer" horizontal>
        <b-input v-model="value.manufacturer" placeholder="Robin" />
      </b-field>
      <b-field label="Model" horizontal>
        <b-input v-model="value.model" placeholder="DR40" />
      </b-field>
      <b-field label="Airworthiness Certificate" horizontal>
        <b-input
          v-model="value.cn"
          maxlength="200"
          type="textarea"
          placeholder="CNRA.. 12/12/1983"
        />
      </b-field>
    </b-tab-item>
    <b-tab-item label="Paces">
      <AircraftDetailPaces :value.sync="value.paces" />
    </b-tab-item>
    <b-tab-item label="Fuel">
      <AircraftDetailConsumptions :value.sync="value.consumptions" />
    </b-tab-item>
    <b-tab-item label="Balance & Weight">
      <AircraftDetailBalance :value.sync="value.balance" />
    </b-tab-item>
    <b-tab-item label="Envelopes">
      <AircraftDetailEnvelopes :value.sync="value.envelopes" />
    </b-tab-item>
    <b-tab-item label="Checklists">
      <AircraftDetailChecklists :value.sync="value.checklists" />
    </b-tab-item>
  </b-tabs>
</template>

<script>
import AircraftDetailPaces from "@/components/AircraftDetailPaces.vue";
import AircraftDetailBalance from "@/components/AircraftDetailBalance.vue";
import AircraftDetailEnvelopes from "@/components/AircraftDetailEnvelopes.vue";
import AircraftDetailConsumptions from "@/components/AircraftDetailConsumptions.vue";
import AircraftDetailChecklists from "@/components/AircraftDetailChecklists.vue";

export default {
  name: "AircraftDetail",
  components: {
    AircraftDetailPaces,
    AircraftDetailBalance,
    AircraftDetailEnvelopes,
    AircraftDetailConsumptions,
    AircraftDetailChecklists,
  },
  props: {
    value: {
      type: Object,
      default() {
        return {
          type: "aircraft",
          registration: undefined,
          manufacturer: undefined,
          model: undefined,
          paces: undefined,
          balance: undefined,
          envelopes: undefined,
          consumptions: undefined,
          checklists: undefined,
        };
      },
    },
  },
  data() {
    return {
      updated: false,
    };
  },
  watch: {
    value: {
      deep: true,
      handler() {
        if (!this.updated) this.$emit("update");
      },
    },
  },
};
</script>
