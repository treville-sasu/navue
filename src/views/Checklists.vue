<template>
  <div class="container is-widescreen">
    <EnsureAircraft v-model="aircraft" />

    <section class="hero is-primary is-hidden-mobile">
      <div class="hero-body">
        <h1 class="title">Checklists</h1>
        <h2 class="subtitle">
          Follow your checklists and validate procedures.
        </h2>
      </div>
    </section>
    <section class="section" v-if="!!aircraft">
      <b-tabs v-model="currentCL" multiline>
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
            <template slot-scope="props">
              <b-table-column
                field="name"
                label="Name"
                :colspan="!props.row.expect ? 2 : 1"
                :centered="!props.row.expect"
                >{{ props.row.name }}</b-table-column
              >

              <b-table-column
                :visible="!!props.row.expect"
                field="expect"
                label="Expectation"
                >{{ props.row.expect }}</b-table-column
              >
            </template>
            <template slot="empty">
              <section class="section">
                <div class="content has-text-grey has-text-centered">
                  <p>Nothing here. Configure your aircraft first.</p>
                </div>
              </section>
            </template>
            <template slot="bottom-left">
              <b-button
                type="is-primary"
                @click="
                  currentCL = (currentCL + 1) % aircraft.checklists.length
                "
                >Next C/L</b-button
              >
            </template>
          </b-table>
        </b-tab-item>
      </b-tabs>
    </section>
  </div>
</template>
<style lang="scss">
@import "~bulma/sass/utilities/_all";
.table tbody tr.is-checked {
  background-color: $success;
  color: $success-invert;
}
</style>

<script>
import EnsureAircraft from "@/components/EnsureAircraft.vue";

export default {
  name: "Checklists",
  components: {
    EnsureAircraft
  },
  data() {
    return {
      aircraft: null,
      currentCL: 0,
      checked: []
    };
  }
};
</script>
