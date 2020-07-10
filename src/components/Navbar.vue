<template>
  <b-navbar fixed-top>
    <template slot="brand">
      <b-navbar-item tag="router-link" :to="{ path: '/' }">
        <img
          src="img/icons/android-chrome-192x192.png"
          alt="Navue, a navigation tool for general aviation."
        />
      </b-navbar-item>
    </template>
    <template slot="start">
      <b-navbar-dropdown
        label="Briefing Room"
        tag="router-link"
        to="/route"
        collapsible
        hoverable
      >
        <b-navbar-item tag="router-link" to="route"
          >Trace a route</b-navbar-item
        >
        <b-navbar-item tag="router-link" to="vac"
          >Approach Charts</b-navbar-item
        >
        <b-navbar-item tag="router-link" to="weather"
          >Weather Maps</b-navbar-item
        >
        <b-navbar-item tag="router-link" to="messages"
          >NOTAM, METAR, TAF, SIGMET</b-navbar-item
        >
        <b-navbar-item tag="router-link" to="balance"
          >Weight and Balance</b-navbar-item
        >
        <hr class="navbar-divider" />
        <b-navbar-item tag="router-link" to="logbook"
          >Edit Nav Log</b-navbar-item
        >
      </b-navbar-dropdown>
      <b-navbar-dropdown label="Fly" hoverable collapsible>
        <b-navbar-item tag="router-link" to="checklists"
          >Checklists</b-navbar-item
        >
        <b-navbar-item tag="router-link" to="logbook"
          >Navigation Log</b-navbar-item
        >
        <b-navbar-item tag="router-link" to="moving-map"
          >Moving Map</b-navbar-item
        >
        <hr class="navbar-divider" />
        <div class="control navbar-item">
          <b-switch>Broadcast Position</b-switch>
        </div>
        <b-navbar-item tag="router-link" to="enroute"
          >Follow aircrafts</b-navbar-item
        >
      </b-navbar-dropdown>
      <b-navbar-dropdown label="Debriefing" hoverable collapsible>
        <b-navbar-item tag="router-link" to="stats">Stats</b-navbar-item>
        <b-navbar-item tag="router-link" to="replay">Replay</b-navbar-item>
        <hr class="navbar-divider" />
        <b-navbar-item tag="router-link" to="trace">Save trace</b-navbar-item>
      </b-navbar-dropdown>
    </template>

    <template slot="end">
      <b-navbar-item tag="router-link" to="aircraft">{{
        selectedAircraft ? selectedAircraft.registration : "Aircrafts"
      }}</b-navbar-item>
      <b-navbar-dropdown hoverable collapsible right>
        <template slot="label">
          <b-icon icon="account" />
        </template>
        <div class="navbar-item">
          <Login />
        </div>
      </b-navbar-dropdown>
    </template>
  </b-navbar>
</template>
<script>
import Login from "@/components/Login.vue";
import { mapState } from "vuex";

export default {
  name: "Navbar",
  components: { Login },
  computed: {
    ...mapState(["selectedAircraft"]),
  },
};
</script>
