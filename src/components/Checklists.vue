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
          :row-class="row => row.action && 'is-selected'"
        >
          <b-table-column
            field="name"
            label="Name"
            :td-attrs="
              row =>
                row.expect
                  ? { colspan: 1 }
                  : { colspan: 2, class: 'has-text-centered' }
            "
            v-slot="props"
            >{{ props.row.name }}</b-table-column
          >
          <b-table-column
            field="expect"
            label="Expectation"
            :td-attrs="row => (row.expect ? {} : { class: 'is-hidden' })"
            v-slot="props"
            >{{ props.row.expect }}</b-table-column
          >

          <template #empty>
            <section class="section">
              <div class="content has-text-grey has-text-centered">
                <p>Nothing here. Configure the aircraft first.</p>
              </div>
            </section>
          </template>
          <template #bottom-left>
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
