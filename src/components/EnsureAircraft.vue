<template>
  <b-modal
    :active="modalActive"
    trap-focus
    has-modal-card
    :destroy-on-hide="true"
    aria-role="dialog"
    aria-modal
  >
    <div class="modal-card">
      <div class="modal-card-body">
        <AircraftSelect @select="onSelectAircraft" />
      </div>
    </div>
  </b-modal>
</template>

<style scoped>
.modal .animation-content .modal-card {
  overflow: visible !important;
}

.modal-card-body {
  overflow: visible !important;
}
</style>

<script>
import AircraftSelect from "@/components/AircraftSelect.vue";

export default {
  name: "EnsureAircraft",
  props: ["value"],
  components: {
    AircraftSelect
  },
  mounted() {
    if (this.$store.state.selectedAircraft)
      this.onSelectAircraft(this.$store.state.selectedAircraft);
  },
  methods: {
    onSelectAircraft(e) {
      //TODO : Cast the type of payload to aircraft
      this.$store.commit("selectAircraft", e);
      this.$emit("input", e);
    }
  },
  computed: {
    modalActive() {
      return !this.value;
    }
  },
  pouch: {
    aircrafts() {
      return {
        database: "navue",
        selector: { registration: { $regex: RegExp(this.search, "i") } },
        fields: ["registration"]
      };
    }
  }
};
</script>
