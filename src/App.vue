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
$navbar-fixed-z: 2000;
$modal-z: $navbar-fixed-z + 100;

@import "bulma";
@import "buefy/src/scss/buefy";

@import "bulmaswatch/flatly/_overrides";
@import "~@creativebulma/bulma-divider";

.is-loading {
  position: relative;
  pointer-events: none;
  opacity: 0.6;
  &:after {
    @include loader;
    position: absolute;
    top: calc(50% - 15vmin);
    left: calc(50vw - 15vmin);
    width: 30vmin;
    height: 30vmin;
    border-width: 0.5em;
    animation: spinAround 800ms infinite linear;
    border-color: transparent transparent $primary $primary !important;
  }
}
.notices {
  z-index: $navbar-fixed-z + 1000;
}
</style>

<script>
import Navbar from "@/components/Navbar.vue";

export default {
  components: { Navbar }
};
</script>
