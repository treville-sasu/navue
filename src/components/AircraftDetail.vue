<template>
  <form>
    <div v-if="canEdit" class="buttons is-grouped is-centered">
      <b-button
        type="is-primary"
        icon-left="content-save"
        native-type="submit"
        @click="updateAircraft(aircraft)"
        :disabled="!unlockSave"
        outlined
        >{{ !aircraft._id ? "Create" : "Save" }}</b-button
      >
      <b-button
        type="is-warning"
        icon-left="close"
        outlined
        @click="$emit('discard')"
        >Discard</b-button
      >
      <b-button
        v-if="!!aircraft._id"
        type="is-danger"
        icon-left="delete"
        @click="deleteAircraft(aircraft)"
        outlined
        >Delete</b-button
      >
    </div>
    <div v-else class="buttons is-grouped is-centered">
      <b-button
        type="is-secondary"
        icon-left="arrow-left"
        outlined
        @click="$emit('discard')"
      ></b-button>
      <b-button
        type="is-secondary"
        icon-left="pencil"
        @click="unlockEdit = true"
      ></b-button>
      <b-button
        type="is-primary"
        icon-left="check"
        @click="selectAircraft(aircraft)"
        >Select</b-button
      >
      <b-button
        @click="downloadJSON(aircraft, `${aircraft.registration}.json`)"
        icon-left="download"
        type="is-secondary"
        outlined
        >Download</b-button
      >
    </div>

    <fieldset :disabled="!canEdit">
      <b-tabs position="is-centered" multiline expanded>
        <b-tab-item label="Identification">
          <section class="section">
            <b-field label="Registration" horizontal>
              <b-input
                v-model="aircraft.registration"
                placeholder="F-...."
                required
              />
            </b-field>
            <b-field label="Manufacturer" horizontal>
              <b-input v-model="aircraft.manufacturer" placeholder="Robin" />
            </b-field>
            <b-field label="Model" horizontal>
              <b-input v-model="aircraft.model" placeholder="DR40" />
            </b-field>
            <b-field label="Airworthiness Certificate" horizontal>
              <b-input
                v-model="aircraft.cn"
                maxlength="200"
                type="textarea"
                placeholder="CNRA.. 12/12/1983"
              />
            </b-field>
          </section>
        </b-tab-item>
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
        <b-tab-item label="Checklists">
          <AircraftDetailChecklists :checklists="aircraft.checklists" />
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
import { ImportExport, TypeCasting } from "@/mixins/apputils";

export default {
  name: "AircraftDetail",
  props: ["aircraft"],
  mixins: [ImportExport, TypeCasting],
  components: {
    AircraftDetailPaces,
    AircraftDetailBalance,
    AircraftDetailEnvelopes,
    AircraftDetailConsumptions,
    AircraftDetailChecklists,
  },
  data() {
    return {
      unlockEdit: false,
      //      TODO: unlock save only if form changed
      unlockSave: true
    };
  },
  mounted() {
    if (!this.aircraft.checklists)
      this.aircraft.checklists = this.proto.checklists;
  },
  computed: {
    canEdit() {
      return this.unlockEdit || !this.aircraft._id;
    }
  },
  methods: {
    selectAircraft(arcft) {
      this.$store.commit("currentAircraft", arcft);
      // .then(() => {
      this.$emit("discard");
      // });
    },
    updateAircraft(arcft) {
      this.$pouch
        .put({
          _id: `${arcft.registration}-${Date.now()}`,
          ...arcft,
          type: "aircraft",
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
          this.$emit("discard");
        })
        .catch(console.error);
    },
  },
};
</script>
