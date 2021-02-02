<template>
  <div id="app">
    <Navbar />
    <!-- TODO: limit keep alive to flying views and componnents include="Checklists, MovingMap, LTimeControl, NavLog" -->
    <keep-alive>
      <router-view />
    </keep-alive>
  </div>
</template>

<style lang="scss">
@import "bulmaswatch/flatly/_variables";
// @import "bulma/sass/utilities/initial-variables";
// $navbar-breakpoint: $tablet;
$navbar-fixed-z: 2000;
$modal-z: $navbar-fixed-z + 100;

@import "bulma";
@import "buefy/src/scss/buefy";

@import "bulmaswatch/flatly/_overrides";
@import "~@creativebulma/bulma-divider";

.is-clickable {
  cursor: pointer !important;
}

.notices {
  z-index: $navbar-fixed-z + 1000;
}

.modal .animation-content .modal-card {
  overflow: visible !important;
}

.modal-card-body {
  overflow: visible !important;
}
</style>

<script>
import Navbar from "@/components/Navbar.vue";

export default {
  components: { Navbar }
};
</script>
