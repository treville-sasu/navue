<template>
  <b-field label="Choose an Aircraft">
    <b-autocomplete
      placeholder="F-xxxx"
      v-model="search"
      :data="aircrafts || []"
      @select="$emit('select', $event)"
      icon="magnify"
      field="registration"
      open-on-focus
      keep-first
      clear-on-select
      clearable
    >
      <template slot="empty">No results for {{ search }}</template>
    </b-autocomplete>
  </b-field>
</template>
<script>
export default {
  name: "AircraftSelect",
  data() {
    return {
      search: ""
    };
  },
  pouch: {
    aircrafts() {
      return {
        database: "navue",
        selector: { registration: { $regex: RegExp(this.search, "i") } },
        fields: ["registration"]
      };
    }
  }
};
</script>
