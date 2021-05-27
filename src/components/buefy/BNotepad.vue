<template>
  <b-input
    v-model="computedValue"
    maxlength="1000"
    type="textarea"
    custom-class="has-fixed-size"
    icon="radio-tower"
    icon-clickable
    @icon-click="modalName = 'BRadio'"
    icon-right="windsock"
    icon-right-clickable
    @icon-right-click="modalName = 'BAtis'"
    v-bind="$attrs"
  />
</template>

<style>
.has-icons-left .textarea {
  padding-left: 2.5em;
}
.has-icons-right .textarea {
  padding-right: 2.5em;
}
</style>

<script>
import BAtis from "@/components/modals/MAtis";
import BRadio from "@/components/modals/MRadio";

export default {
  name: "BNotepad",
  props: {
    value: {
      type: String,
      default() {
        return new String();
      }
    }
  },
  // eslint-disable-next-line vue/no-unused-components
  components: { BAtis, BRadio },
  data() {
    return {
      modalName: null
    };
  },
  computed: {
    computedValue: {
      get() {
        return this.value;
      },
      set(value) {
        this.$emit("input", value);
      }
    }
  },
  methods: {
    appendLine(content) {
      let notes = String(this.value);
      if (!notes.match(/.*(\n$)/)) notes += "\n";
      if (content) notes += content;
      if (!notes.match(/.*(\n$)/)) notes += "\n";
      this.$emit("input", notes);
    }
  },
  watch: {
    value(value) {
      this.newValue = value;
    },
    modalName(name) {
      if (name)
        this.modal = this.$buefy.modal.open({
          parent: this,
          component: this.$options.components[name],
          // props: { navigation: this.navigation },
          events: { append: this.appendLine },
          hasModalCard: false,
          trapFocus: true,
          onCancel: () => (this.modalName = undefined)
        });
    }
  }
};
</script>
