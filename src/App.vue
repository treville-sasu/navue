<template>
  <div id="app">
    <Navbar />
    <router-view />
  </div>
</template>

<style lang="scss">
$navbar-fixed-z: 3000;
$modal-z: $navbar-fixed-z + 1;
// .navbar {
//   border-radius: 0;
//   z-index: 3000;
// }
// https://jenil.github.io/bulmaswatch/flatly/
@import "bulmaswatch/flatly/bulmaswatch.scss";
@import "buefy/src/scss/buefy";
</style>

<script>
import Navbar from "@/components/Navbar.vue";

export default {
  components: { Navbar }
};
</script>
