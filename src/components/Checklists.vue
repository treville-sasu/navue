<template>
  <section class="section">
    <b-tabs class="box" v-model="currentCL" multiline>
      <b-tab-item label="Paces" v-if="paces">
        <div class="grid">
          <div
            class="notification is-primary"
            v-for="pace in paces"
            :key="pace.name"
          >
            <h1 class="title">
              <b>{{ pace }}</b>
            </h1>
            <h2 class="subtitle">
              {{ pace.name }}
            </h2>
          </div>
        </div>
      </b-tab-item>
      <b-tab-item v-for="cl in checklists" :label="cl.name" :key="cl.name">
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
              @click="currentCL = (currentCL + 1) % (checklists.length + 1)"
              >Next C/L</b-button
            >
          </template>
        </b-table>
      </b-tab-item>
    </b-tabs>
  </section>
</template>

<script>
export default {
  name: "Checklists",
  data() {
    return {
      currentCL: 0
    };
  },
  computed: {
    checklists() {
      return this.$store.state.currentAircraft.checklists;
    },
    paces() {
      return this.$store.state.currentAircraft.paces;
    },
    checked: {
      get() {
        return this.$store.state.currentFlight.checked;
      },
      set(val) {
        this.$store.state.currentFlight.checked = val;
      }
    }
  }
};
</script>
