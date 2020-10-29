<template>
  <section>
    <AircraftSelect
      v-model="aircraft"
      @update="canSave = false"
      required
      allowNew
    />
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
    <section class="section" v-if="aircraft">
      <div class="buttons is-grouped is-centered">
        <b-button
          type="is-warning"
          :icon-left="canSave ? 'close' : 'arrow-left'"
          outlined
          @click="aircraft = null"
          :label="canSave ? 'Discard' : 'Back'"
        />
        <b-button
          type="is-primary"
          icon-left="content-save"
          @click="
            $root.$emit('aircraft-select', 'save');
            canSave = false;
          "
          :disabled="!canSave"
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
      <AircraftDetail v-model="aircraft" @update="canSave = true" />
    </section>
  </section>
</template>

<script>
import AircraftSelect from "@/components/AircraftSelect.vue";
import AircraftDetail from "@/components/AircraftDetail.vue";

export default {
  name: "Aircraft",
  components: {
    AircraftDetail,
    AircraftSelect,
  },
  data() {
    return {
      aircraft: null,
      canSave: false,
    };
  },
};
</script>
