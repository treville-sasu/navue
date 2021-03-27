<template>
  <section class="section">
    <div class="notification is-primary is-light" v-if="!aircraft">
      <h1 class="title">
        Select an aircraft
      </h1>
      <AircraftManager select />
    </div>
    <b-tabs v-else class="box" v-model="currentCL" multiline>
      <b-tab-item label="Paces" v-if="paces">
        <div class="grid">
          <div
            class="notification is-primary"
            v-for="pace in paces"
            :key="pace.name"
          >
            <h1 class="title">
              <b>{{ pace | toString(0) }}</b>
            </h1>
            <h2 class="subtitle">
              {{ pace.name }}
            </h2>
          </div>
        </div>
      </b-tab-item>
      <b-tab-item
        v-for="cl in aircraft.checklists"
        :label="cl.name"
        :key="cl.name"
      >
        <b-table
          :data="cl.items"
          checkable
          :is-row-checkable="row => !!row.expect"
          checkbox-position="right"
          :checked-rows.sync="checked"
          :header-checkable="false"
          :mobile-cards="false"
          :row-class="(row, index) => row.action && 'is-selected'"
        >
          <b-table-column field="name" label="Name" v-slot="props">{{
            props.row.name
          }}</b-table-column>
          <!-- TODO: fix visible, centered and colspan https://github.com/buefy/buefy/issues/2980 -->
          <!-- :centered="!props.row.expect" -->
          <!-- :colspan="!props.row.expect ? 2 : 1" -->

          <b-table-column field="expect" label="Expectation" v-slot="props">{{
            props.row.expect
          }}</b-table-column>
          <!-- :visible="!!props.row.expect" -->
          <template v-slot:empty>
            <section class="section">
              <div class="content has-text-grey has-text-centered">
                <p>Nothing here. Configure the aircraft first.</p>
              </div>
            </section>
          </template>
          <template v-slot:bottom-left>
            <b-button
              type="is-primary"
              @click="currentCL = (currentCL + 1) % aircraft.checklists.length"
              >Next C/L</b-button
            >
          </template>
        </b-table>
      </b-tab-item>
    </b-tabs>
  </section>
</template>

<script>
import AircraftManager from "@/components/AircraftManager.vue";
import UnitSystem from "@/mixins/UnitSystem.js";
import { WakeLock } from "@/mixins/apputils.js";

export default {
  name: "Checklists",
  mixins: [WakeLock, UnitSystem],
  components: { AircraftManager },
  data() {
    return {
      currentCL: 0,
      checked: []
    };
  },
  computed: {
    aircraft() {
      return this.$store.state.currentAircraft;
    },
    paces() {
      return this.aircraft.paces;
    }
  }
};
</script>
