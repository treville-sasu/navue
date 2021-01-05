<template>
  <b-collapse :open="false" position="is-top">
    <span slot="trigger" slot-scope="props">
      <b-icon :icon="!props.open ? 'chevron-down' : 'chevron-up'" />
      <span class="has-text-weight-bold">
        {{ message | firstLine }}
      </span>
    </span>
    <span class="has-text-weight-bold">
      {{ message | lastLines }}
    </span>
  </b-collapse>
</template>

<style scoped>
pre {
  margin: 0.5rem;
  padding: 0.5rem;
  white-space: pre-line;
}
</style>

<script>
// TODO: allow caching
export default {
  name: "WeatherMessage",
  props: {
    message: String
  },
  computed: {},
  filters: {
    firstLine(value) {
      return value.split("\n")[0];
    },
    lastLines(value) {
      return value
        .split("\n")
        .slice(1)
        .join("\n");
    }
  }
};
</script>
