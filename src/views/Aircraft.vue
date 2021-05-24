<template>
  <section>
    <section class="section columns">
      <div class="column is-one-fifth">
        <AircraftManager create edit inline expanded v-slot="{ selected }">
          <b-button type="is-primary" icon-right="chevron-down">
            {{
              selected
                ? selected.registration || "unsaved"
                : "Select an aircraft"
            }}
          </b-button>
        </AircraftManager>
      </div>
      <div class="column">
        <b-notification
          v-if="!aircraft"
          has-icon
          icon="airplane"
          :closable="false"
        >
          <h1 class="title">Choose, edit & manage your aircrafts</h1>
          <h2 class="subtitle">
            aircrafts are stored in browser and synced online.
          </h2>
        </b-notification>

        <b-tabs position="is-centered" multiline expanded v-else>
          <b-tab-item label="Identification">
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
                placeholder="CNRA.. 30/04/1983"
              />
            </b-field>
          </b-tab-item>
          <b-tab-item label="Paces">
            <AircraftDetailPaces :value.sync="aircraft.paces" />
          </b-tab-item>
          <b-tab-item label="Fuel">
            <AircraftDetailConsumptions :value.sync="aircraft.consumptions" />
          </b-tab-item>
          <b-tab-item label="Balance & Weight">
            <AircraftDetailBalance :value.sync="aircraft.balance" />
          </b-tab-item>
          <b-tab-item label="Envelopes">
            <AircraftDetailEnvelopes :value.sync="aircraft.envelopes" />
          </b-tab-item>
          <b-tab-item label="Checklists">
            <AircraftDetailChecklists :value.sync="aircraft.checklists" />
          </b-tab-item>
        </b-tabs>
      </div>
    </section>
  </section>
</template>
<script>
import AircraftManager from "@/components/managers/AircraftManager.vue";

import AircraftDetailPaces from "@/components/AircraftDetailPaces.vue";
import AircraftDetailBalance from "@/components/AircraftDetailBalance.vue";
import AircraftDetailEnvelopes from "@/components/AircraftDetailEnvelopes.vue";
import AircraftDetailConsumptions from "@/components/AircraftDetailConsumptions.vue";
import AircraftDetailChecklists from "@/components/AircraftDetailChecklists.vue";

export default {
  name: "Aircraft",
  components: {
    AircraftDetailPaces,
    AircraftDetailBalance,
    AircraftDetailEnvelopes,
    AircraftDetailConsumptions,
    AircraftDetailChecklists,
    AircraftManager
  },
  computed: {
    aircraft() {
      return this.$store.state.currentAircraft;
    }
  }
};
</script>
