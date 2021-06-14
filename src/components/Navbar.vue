<template>
  <b-navbar fixed-top class="is-radiusless">
    <template slot="brand">
      <b-navbar-item tag="router-link" :to="{ path: '/' }">
        <img
          src="img/icons/android-chrome-192x192.png"
          alt="Navue, a navigation tool for general aviation."
        />
      </b-navbar-item>
    </template>
    <template slot="start">
      <b-navbar-item tag="router-link" :to="{ name: 'Briefing' }"
        >Briefing</b-navbar-item
      >
      <b-navbar-item tag="router-link" :to="{ name: 'Fly' }">Fly</b-navbar-item>
      <b-navbar-item tag="router-link" :to="{ name: 'Debriefing' }" disabled
        >Debriefing</b-navbar-item
      >
      <b-navbar-item tag="router-link" :to="{ name: 'Monitor' }"
        >Monitor</b-navbar-item
      >
    </template>

    <template slot="end">
      <b-navbar-item>
        <AircraftManager :triggers="['click', 'hover']" v-slot="{ selected }">
          <b-button type="is-primary" icon-right="chevron-down">
            {{ selected ? selected.registration : "Select an aircraft" }}
          </b-button>
        </AircraftManager>
      </b-navbar-item>
      <b-navbar-dropdown hoverable collapsible right>
        <template slot="label">
          <b-icon icon="account" />
        </template>
        <b-navbar-item tag="div" style="min-width: 30vw;">
          <Login />
        </b-navbar-item>
      </b-navbar-dropdown>
    </template>
  </b-navbar>
</template>

<script>
import AircraftManager from "@/components/managers/AircraftManager.vue";
import Login from "@/components/Login.vue";

export default {
  name: "Navbar",
  components: { AircraftManager, Login },
  computed: {
    currentAircraft() {
      return this.$store.state.currentAircraft;
    }
  }
};
</script>
