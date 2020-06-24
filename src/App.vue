<template>
  <div id="app">
    <b-navbar fixed-top>
      <template slot="brand">
        <b-navbar-item tag="router-link" :to="{ path: '/' }">
          <img src="favicon.png" alt="Navue, a navigation tool for general aviation." />
        </b-navbar-item>
      </template>
      <template slot="start">
        <b-navbar-item tag="router-link" to="/aircraft">Aircrafts</b-navbar-item>
        <b-navbar-dropdown label="Prepare a Flight">
          <b-navbar-item tag="router-link" to="/route">Trace a route</b-navbar-item>
          <b-navbar-item tag="router-link" to="logbook">Edit Log</b-navbar-item>
          <b-navbar-item tag="router-link" to="getNOTAM">Get NOTAMs</b-navbar-item>
          <b-navbar-item tag="router-link" to="getMETAR">Get METAR & TAF</b-navbar-item>
          <b-navbar-item tag="router-link" to="weatherMap">Weather Map</b-navbar-item>
          <b-navbar-item tag="router-link" to="balance">Weight and Balance</b-navbar-item>
        </b-navbar-dropdown>
        <b-navbar-dropdown label="Take Off !">
          <b-navbar-item tag="router-link" to="/about">About</b-navbar-item>
        </b-navbar-dropdown>
      </template>

      <template slot="end">
        <b-navbar-item tag="h3">
          {{
          selectedAircraft.registration
          }}
        </b-navbar-item>
        <b-navbar-item tag="div">
          <div class="buttons">
            <a class="button is-primary">
              <strong>Sign up</strong>
            </a>
            <a class="button is-light">Log in</a>
          </div>
        </b-navbar-item>
      </template>
    </b-navbar>
    <router-view />
  </div>
</template>
<style lang="scss">
// Import Bulma's core
@import "~bulma/sass/utilities/_all";

$navbar-fixed-z: 3000;

// Set your colors
$primary: #5172dd;
$primary-invert: findColorInvert($primary);
// $twitter: #4099ff;
// $twitter-invert: findColorInvert($twitter);

// Setup $colors to use as bulma classes (e.g. 'is-twitter')
// $colors: (
//   "white": (
//     $white,
//     $black,
//   ),
//   "black": (
//     $black,
//     $white,
//   ),
//   "light": (
//     $light,
//     $light-invert,
//   ),
//   "dark": (
//     $dark,
//     $dark-invert,
//   ),
//   "primary": (
//     $primary,
//     $primary-invert,
//   ),
//   "info": (
//     $info,
//     $info-invert,
//   ),
//   "success": (
//     $success,
//     $success-invert,
//   ),
//   "warning": (
//     $warning,
//     $warning-invert,
//   ),
//   "danger": (
//     $danger,
//     $danger-invert,
//   ),
//   "twitter": (
//     $twitter,
//     $twitter-invert,
//   ),
// );

// Links
$link: $primary;
$link-invert: $primary-invert;
$link-focus-border: $primary;

// Import Bulma and Buefy styles
@import "~bulma";
@import "~buefy/src/scss/buefy";
</style>
<script>
import { mapState } from "vuex";

export default {
  computed: {
    ...mapState(["selectedAircraft"])
  }
};
</script>
