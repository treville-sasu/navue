<template>
  <section>
    <AircraftSelect v-model="aircraft" :saved.sync="saved" required editable />
    <!-- @update="saved = true" -->
    <section class="hero is-primary is-hidden-mobile">
      <div class="hero-body">
        <div class="container">
          <h1 class="title">Choose, edit & manage your aircrafts</h1>
          <h2 class="subtitle">
            aircrafts are stored in browser and synced online.
          </h2>
        </div>
      </div>
    </section>
    <section class="section" v-if="!(aircraft === null)">
      <div class="buttons is-grouped is-centered">
        <b-button
          :type="!saved ? 'is-danger' : 'is-primary'"
          :disabled="saved"
          icon-left="content-save"
          @click="saved = null"
          outlined
          label="Save"
        />
        <b-button
          type="is-primary"
          icon-left="view-carousel-outline"
          @click="$root.$emit('aircraft-select')"
          outlined
          label="Manage"
        />
      </div>

      <b-tabs position="is-centered" multiline expanded v-if="aircraft">
        <b-tab-item label="Identification">
          <b-field label="Registration" horizontal>
            <b-input
              @input="saved = false"
              v-model="aircraft.registration"
              placeholder="F-...."
              required
            />
          </b-field>
          <b-field label="Manufacturer" horizontal>
            <b-input
              @input="saved = false"
              v-model="aircraft.manufacturer"
              placeholder="Robin"
            />
          </b-field>
          <b-field label="Model" horizontal>
            <b-input
              @input="saved = false"
              v-model="aircraft.model"
              placeholder="DR40"
            />
          </b-field>
          <b-field label="Airworthiness Certificate" horizontal>
            <b-input
              @input="saved = false"
              v-model="aircraft.cn"
              maxlength="200"
              type="textarea"
              placeholder="CNRA.. 12/12/1983"
            />
          </b-field>
        </b-tab-item>
        <b-tab-item label="Paces">
          <AircraftDetailPaces
            @input="saved = false"
            :value.sync="aircraft.paces"
          />
        </b-tab-item>
        <b-tab-item label="Fuel">
          <AircraftDetailConsumptions
            @input="saved = false"
            :value.sync="aircraft.consumptions"
          />
        </b-tab-item>
        <b-tab-item label="Balance & Weight">
          <AircraftDetailBalance
            @input="saved = false"
            :value.sync="aircraft.balance"
          />
        </b-tab-item>
        <b-tab-item label="Envelopes">
          <AircraftDetailEnvelopes
            @input="saved = false"
            :value.sync="aircraft.envelopes"
          />
        </b-tab-item>
        <b-tab-item label="Checklists">
          <AircraftDetailChecklists
            @input="saved = false"
            :value.sync="aircraft.checklists"
          />
        </b-tab-item>
      </b-tabs>
    </section>
  </section>
</template>
<script>
import AircraftSelect from "@/components/AircraftSelect.vue";

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
    AircraftSelect
  },
  data() {
    return {
      aircraft: null,
      saved: true
    };
  }
};
</script>
