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
      <b-navbar-dropdown label="Briefing Room" collapsible hoverable>
        <b-navbar-item tag="router-link" :to="{ name: 'Route' }"
          >Trace a route</b-navbar-item
        >
        <!-- <b-navbar-item tag="router-link" to="approach"
          >Approach Charts</b-navbar-item
        > -->
        <b-navbar-item tag="router-link" :to="{ name: 'Weather' }"
          >Weather</b-navbar-item
        >
        <!-- <b-navbar-item tag="router-link" to="notam"
          >NOTAM & Sup AIP</b-navbar-item
        > -->
        <b-navbar-item tag="router-link" :to="{ name: 'Balance' }"
          >Weight and Balance</b-navbar-item
        >
        <hr class="navbar-divider" />
        <!-- <b-navbar-item tag="router-link" to="logbook"
          >Edit Nav Log</b-navbar-item
        > -->
      </b-navbar-dropdown>
      <b-navbar-dropdown label="Fly" hoverable collapsible>
        <b-navbar-item tag="router-link" :to="{ name: 'Checklists' }"
          >Checklists</b-navbar-item
        >
        <!-- <b-navbar-item tag="router-link" to="logbook"
          >Navigation Log</b-navbar-item
        > -->
        <b-navbar-item tag="router-link" :to="{ name: 'MovingMap' }"
          >Moving Map</b-navbar-item
        >
        <hr class="navbar-divider" />
        <!-- <div class="control navbar-item">
          <b-switch>Broadcast Position</b-switch>
        </div> -->
        <!-- <b-navbar-item tag="router-link" to="enroute"
          >Follow aircrafts</b-navbar-item
        > -->
      </b-navbar-dropdown>
      <!-- <b-navbar-dropdown label="Debriefing" hoverable collapsible>
        <b-navbar-item tag="router-link" to="stats">Stats</b-navbar-item>
        <b-navbar-item tag="router-link" to="replay">Replay</b-navbar-item>
        <hr class="navbar-divider" />
        <b-navbar-item tag="router-link" to="trace">Save trace</b-navbar-item>
      </b-navbar-dropdown> -->
    </template>

    <template slot="end">
      <b-navbar-item
        tag="router-link"
        :to="{
          name: 'Aircrafts',
          params: { id: currentAircraft ? currentAircraft._id : null },
        }"
        >{{
          currentAircraft ? currentAircraft.registration : "Aircrafts"
        }}</b-navbar-item
      >
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

export default {
  name: "Navbar",
  components: { Login },
  computed: {
    currentAircraft() {
      return this.$store.state.currentAircraft;
    },
  },
};
</script>
