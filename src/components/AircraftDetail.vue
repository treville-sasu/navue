<template>
  <form>
    <div v-if="canEdit" class="buttons is-grouped is-centered">
      <b-button
        type="is-primary"
        icon-left="content-save"
        native-type="submit"
        @click="updateAircraft(value)"
        :disabled="!canSave"
        outlined
        >{{ !value._id ? "Create" : "Save" }}</b-button
      >
      <b-button
        type="is-warning"
        icon-left="close"
        outlined
        @click="$emit('discard')"
        >Discard</b-button
      >
      <b-button
        v-if="!!value._id"
        type="is-danger"
        icon-left="delete"
        @click="deleteAircraft(value)"
        outlined
        >Delete</b-button
      >
    </div>
    <div v-else class="buttons is-grouped is-centered">
      <b-button
        type="is-secondary"
        icon-left="arrow-left"
        outlined
        @click="$emit('input', null)"
      ></b-button>
      <b-button
        type="is-secondary"
        icon-left="pencil"
        @click="unlockEdit = true"
      ></b-button>
      <b-button
        type="is-primary"
        icon-left="check"
        @click="selectAircraft(value)"
        >Select</b-button
      >
      <b-button
        @click="downloadJSON(value, `${value.registration}.json`)"
        icon-left="download"
        type="is-secondary"
        outlined
        >Download</b-button
      >
    </div>

    <fieldset :disabled="!canEdit">
      <b-tabs position="is-centered" multiline expanded>
        <b-tab-item label="Identification">
          <b-field label="Registration" horizontal>
            <b-input
              v-model="value.registration"
              placeholder="F-...."
              required
            />
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
          <AircraftDetailPaces v-model="value.paces" />
        </b-tab-item>
        <b-tab-item label="Fuel">
          <AircraftDetailConsumptions v-model="value.consumptions" />
        </b-tab-item>
        <b-tab-item label="Balance & Weight">
          <AircraftDetailBalance v-model="value.balance" />
        </b-tab-item>
        <b-tab-item label="Envelopes">
          <AircraftDetailEnvelopes v-model="value.envelopes" />
        </b-tab-item>
        <b-tab-item label="Checklists">
          <AircraftDetailChecklists v-model="value.checklists" />
        </b-tab-item>
      </b-tabs>
    </fieldset>
  </form>
</template>

<style scoped lang="scss"></style>

<script>
import AircraftDetailPaces from "@/components/AircraftDetailPaces.vue";
import AircraftDetailBalance from "@/components/AircraftDetailBalance.vue";
import AircraftDetailEnvelopes from "@/components/AircraftDetailEnvelopes.vue";
import AircraftDetailConsumptions from "@/components/AircraftDetailConsumptions.vue";
import AircraftDetailChecklists from "@/components/AircraftDetailChecklists.vue";
import { ImportExport } from "@/mixins/apputils";

export default {
  name: "AircraftDetail",
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
  mixins: [ImportExport],
  components: {
    AircraftDetailPaces,
    AircraftDetailBalance,
    AircraftDetailEnvelopes,
    AircraftDetailConsumptions,
    AircraftDetailChecklists,
  },
  data() {
    return {
      canSave: false,
      unlockEdit: false,
    };
  },
  computed: {
    canEdit() {
      return this.unlockEdit || !this.value._id;
    },
  },
  watch: {
    value: {
      deep: true,
      handler() {
        this.canSave = true;
      },
    },
  },
  methods: {
    selectAircraft(arcft) {
      this.$store.commit("currentAircraft", arcft);
      this.$emit("input", null);
    },
    updateAircraft(arcft) {
      this.$pouch
        .put({
          _id: `${arcft.registration}-${Date.now()}`,
          ...arcft,
        })
        .then((res) => {
          this.unlockEdit = false;
          this.selectAircraft({ ...arcft, ...res });
        })
        .catch(console.error);
    },
    deleteAircraft(arcft) {
      this.$pouch
        .remove(arcft)
        .then(() => {
          this.$emit("input", null);
        })
        .catch(console.error);
    },
  },
};
</script>
