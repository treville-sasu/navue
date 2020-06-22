<template>
  <form class="section">
    <div class="level">
      <div class="level-left">
        <div class="level-item">
          <b-button type="is-secondary" icon-left="arrow-left" @click="$emit('discard')"></b-button>
        </div>
        <div class="level-item">
          <b-field v-if="canEdit" label="Registration" horizontal>
            <b-input v-model="aircraft.registration" placeholder="F-...." required />
          </b-field>
          <h2 v-else class="title">{{ aircraft.registration }}</h2>
        </div>
      </div>
      <div class="level-right">
        <div v-if="canEdit" class="buttons is-grouped is-centered">
          <b-button
            type="is-primary"
            icon-left="content-save"
            native-type="submit"
            @click="updateA(aircraft)"
            :disabled="!unlockSave"
            outlined
          >{{ !aircraft._id ? "Create" : "Save" }}</b-button>
          <b-button type="is-warning" icon-left="close" outlined @click="$emit('discard')">Discard</b-button>
          <b-button
            v-if="!!aircraft._id"
            type="is-danger"
            icon-left="delete"
            @click="deleteA(aircraft)"
            outlined
          >Delete</b-button>
        </div>
        <div v-else class="buttons">
          <b-button type="is-secondary" icon-left="pencil" @click="unlockEdit = true"></b-button>
          <b-button type="is-primary" icon-left="check" @click="selectAircraft(aircraft)">Select</b-button>
          <b-button
            @click="downloadJSON(aircraft, `${aircraft.registration}.json`)"
            icon-left="download"
            type="is-secondary"
            outlined
          >Download</b-button>
        </div>
      </div>
    </div>

    <div></div>

    <fieldset :disabled="!canEdit">
      <b-tabs position="is-centered" multiline expanded>
        <b-tab-item label="Généralités">in progress</b-tab-item>
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
        <b-tab-item label="Checklists">in progress</b-tab-item>
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
import { mapActions, mapMutations } from "vuex";
import { editDetails } from "@/mixins/casting";

export default {
  name: "AircraftDetail",
  props: ["aircraft"],
  mixins: [editDetails],
  data() {
    return {
      unlockEdit: false,
      //      TODO: unlock save only if form changed
      unlockSave: true
    };
  },
  components: {
    AircraftDetailPaces,
    AircraftDetailBalance,
    AircraftDetailEnvelopes,
    AircraftDetailConsumptions
  },
  computed: {
    canEdit() {
      return this.unlockEdit || !this.aircraft._id;
    }
  },
  methods: {
    updateA(payload) {
      this.$store.dispatch("updateAircraft", payload).then(() => {
        this.unlockEdit = false;
      });
    },
    selectA(payload) {
      this.$store.commit("selectAircraft", payload).then(() => {
        this.$emit("discard");
      });
    },
    deleteA(payload) {
      this.$store.dispatch("deleteAircraft", payload).then(() => {
        this.$emit("discard");
      });
    },
    ...mapMutations(["selectAircraft"]),
    ...mapActions(["updateAircraft", "deleteAircraft"])
  }
};
</script>
