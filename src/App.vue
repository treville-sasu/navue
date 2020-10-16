<template>
  <div id="app">
    <Navbar />
    <router-view />
  </div>
</template>

<style lang="scss">
@import "bulmaswatch/flatly/_variables";
// @import "bulma/sass/utilities/initial-variables";
// $navbar-breakpoint: $tablet;
$navbar-fixed-z: 3000;
$modal-z: $navbar-fixed-z + 1;

@import "bulma";
@import "buefy/src/scss/buefy";

@import "bulmaswatch/flatly/_overrides";
</style>

<script>
import Navbar from "@/components/Navbar.vue";

export default {
  components: { Navbar }
};
</script>
