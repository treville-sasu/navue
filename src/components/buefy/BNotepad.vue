<template>
  <b-input
    v-model="computedValue"
    maxlength="1000"
    type="textarea"
    custom-class="has-fixed-size"
    icon="radio-tower"
    icon-clickable
    @icon-click="modalWidget('BRadio')"
    icon-right="windsock"
    icon-right-clickable
    @icon-right-click="modalWidget('BAtis')"
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
    appendLine(newLine) {
      if (newLine)
        // positive lookbehind in replace() : string should not be empty
        this.$emit("input", this.value.replace(/(?<=.+)\n*$/, "\n") + newLine);
    },
    modalWidget(name) {
      this.$buefy.modal.open({
        parent: this,
        component: this.$options.components[name],
        events: { append: this.appendLine },
        hasModalCard: false
      });
    }
  },
  watch: {
    value(value) {
      this.newValue = value;
    }
  }
};
</script>
