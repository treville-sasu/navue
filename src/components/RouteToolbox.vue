<template>
  <b-field>
    <b-radio-button v-model="tool" native-value="route">
      <b-tooltip label="Add a route" v-bind="tooltip">
        <b-icon icon="map-plus" v-bind="icon" />
      </b-tooltip>
    </b-radio-button>

    <b-radio-button v-model="tool" native-value="clear" :disabled="!navigation">
      <b-tooltip label="Clear current route" v-bind="tooltip">
        <b-icon icon="eraser" v-bind="icon" />
      </b-tooltip>
    </b-radio-button>

    <b-radio-button
      v-model="modalName"
      native-value="NavigationDetails"
      :disabled="!navigation"
    >
      <b-tooltip label="Navigation Details" v-bind="tooltip">
        <b-icon icon="clipboard-list-outline" v-bind="icon" />
      </b-tooltip>
    </b-radio-button>

    <b-radio-button v-model="tool" native-value="getinfo" disabled>
      <b-tooltip label="Display info on this position" v-bind="tooltip">
        <b-icon icon="crosshairs-question" v-bind="icon" />
      </b-tooltip>
    </b-radio-button>
  </b-field>
</template>

<script>
import NavigationDetails from "@/components/NavigationDetails";

export default {
  name: "RouteToolbox",
  // eslint-disable-next-line vue/no-unused-components
  components: { NavigationDetails },
  props: { value: String, tooltip: Object, icon: Object },
  data() {
    return {
      modalName: null
    };
  },
  computed: {
    tool: {
      get: function() {
        return this.value;
      },
      set: function(newVal) {
        this.$emit("input", newVal);
      }
    },
    navigation() {
      return this.$store.state.currentNavigation;
    }
  },
  watch: {
    modalName(name) {
      if (name)
        this.modal = this.$buefy.modal.open({
          parent: this,
          component: this.$options.components[name],
          hasModalCard: false,
          trapFocus: true,
          onCancel: () => (this.modalName = undefined)
        });
    }
  }
};
</script>
