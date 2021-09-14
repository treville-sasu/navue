<template>
  <b-collapse :open="false" position="is-top">
    <div slot="trigger" slot-scope="props">
      <b-icon :icon="!props.open ? 'chevron-down' : 'chevron-up'" />
      <span class="has-text-weight-bold">{{ notam.id }} </span>
      <span class="is-italic">
        {{ notam.E | firstLine }}
      </span>
    </div>
    <pre>
      {{ message }}
    </pre>
  </b-collapse>
</template>

<style scoped>
.mb-0 {
  margin-bottom: 0 !important;
}
pre {
  margin: 0.5rem;
  padding: 0.5rem;
  white-space: pre-line;
}
</style>

<script>
export default {
  name: "NotamMessage",
  props: {
    message: String
  },
  computed: {
    notam() {
      return {
        id: this.message.split("\n")[0].trim(),
        ...Object.fromEntries(
          Array.from(
            this.message.matchAll(
              /([QABCDEFG])\) (.+?)(?=(?: |\n)+[QABCDEFG]\) |$)/gs
            )
          ).map(m => [m[1], m[2].trim()])
        )
      };
    }
  },
  filters: {
    firstLine(value) {
      return value.split("\n")[0];
    }
  }
};
</script>
