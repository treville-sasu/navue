<template>
  <div id="app">
    <Navbar class="is-hidden-printer" />
    <router-view />
  </div>
</template>

<style lang="scss">
html,
body,
#app {
  height: 100%;
  width: 100%;
}

@import "bulmaswatch/flatly/_variables";
@import "bulma/sass/utilities/initial-variables";
$navbar-breakpoint: $tablet;
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
    align-items: flex-end;

    :first-child:not(:only-child) .button,
    :first-child:not(:only-child) .input,
    :first-child:not(:only-child) .select select {
      border-top-left-radius: $control-radius;
      border-top-right-radius: $control-radius;
      border-bottom-right-radius: 0;
      border-bottom-left-radius: 0;
    }
    :not(:first-child):not(:last-child):not(:only-child) .button,
    :not(:first-child):not(:last-child):not(:only-child) .input,
    :not(:first-child):not(:last-child):not(:only-child) .select select {
      border-top-left-radius: 0;
      border-bottom-left-radius: 0;
      border-top-right-radius: 0;
      border-bottom-right-radius: 0;
    }
    :last-child:not(:only-child) .button,
    :last-child:not(:only-child) .input,
    :last-child:not(:only-child) .select select {
      border-bottom-left-radius: $control-radius;
      border-bottom-right-radius: $control-radius;
      border-top-left-radius: 0;
      border-top-right-radius: 0;
    }
    .tag:last-child {
      margin-right: 0.5em;
    }
  }
  @include from($desktop) {
    :first-child:not(:only-child) .button,
    :first-child:not(:only-child) .input,
    :first-child:not(:only-child) .select select {
      border-top-left-radius: $control-radius;
      border-bottom-left-radius: $control-radius;
      border-top-right-radius: 0;
      border-bottom-right-radius: 0;
    }
    :not(:first-child):not(:last-child):not(:only-child) .button,
    :not(:first-child):not(:last-child):not(:only-child) .input,
    :not(:first-child):not(:last-child):not(:only-child) .select select {
      border-top-left-radius: 0;
      border-bottom-left-radius: 0;
      border-top-right-radius: 0;
      border-bottom-right-radius: 0;
    }
    :last-child:not(:only-child) .button,
    :last-child:not(:only-child) .input,
    :last-child:not(:only-child) .select select {
      border-top-left-radius: 0;
      border-bottom-left-radius: 0;
      border-bottom-right-radius: $control-radius;
      border-top-right-radius: $control-radius;
    }
  }
  .button {
    border-width: 0px;
  }
}

.notices {
  z-index: $navbar-fixed-z + 1000;
}

.dropdown.is-mobile-modal > .dropdown-menu {
  overflow: visible !important;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  grid-gap: $column-gap;
}

.placeholder {
  position: relative;
  border-style: dashed;
  border-radius: 0.5em;
  height: 5em;
  display: flex;
  align-items: center;
  justify-content: center;
}

@media print {
  @page {
    margin: 1cm;
  }
  section {
    // break-before: always;
    break-inside: avoid;
  }
  a[href]:after {
    content: " (" attr(href) ")";
  }
  .is-hidden-printer {
    display: none !important;
  }
}
</style>

<script>
import Navbar from "@/components/Navbar.vue";

export default {
  components: { Navbar },
};
</script>
