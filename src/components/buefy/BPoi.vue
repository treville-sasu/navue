<template>
  <b-field>
    <b-checkbox-button
      v-for="item in list"
      :key="item.id"
      :value="value"
      v-bind="$attrs"
      v-on="$listeners"
      :native-value="item"
    >
      {{ item.name }}
    </b-checkbox-button>
  </b-field>
</template>

<script>
export default {
  name: "BPoi",
  props: {
    value: Array,
    items: Array
  },
  computed: {
    list() {
      return [...new Set(this.items)].map(id => ({ id, name: id }));
    }
  }
};
</script>
