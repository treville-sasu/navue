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

.is-clickable {
  cursor: pointer !important;
}

.is-stackable .field.has-addons,
.is-stackable.tags {
  @include until($desktop) {
    flex-direction: column;
    align-items: end;
  }
}

.notices {
  z-index: $navbar-fixed-z + 1000;
}

.modal-content,
.modal-card,
.modal-card-body {
  overflow: visible !important;
}

.dropdown.is-mobile-modal > .dropdown-menu {
  overflow: visible !important;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  grid-gap: $column-gap;
}
</style>

<script>
import Navbar from "@/components/Navbar.vue";

export default {
  components: { Navbar }
};
</script>
