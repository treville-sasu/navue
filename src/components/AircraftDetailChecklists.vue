<template>
  <section>
    <b-button @click="addList" type="is-primary">Add a list</b-button>
    <b-tabs v-model="currentList" vertical>
      <b-tab-item
        v-for="(checklist, index) in value"
        :key="index"
        :value="`${index}`"
        :label="checklist.name || `${index + 1}`"
      >
        <b-field label="Name">
          <p class="control">
            <b-button @click="removeList(index)" icon-right="close" />
          </p>
          <b-input v-model="checklist.name" />
        </b-field>
        <b-table :data="checklist.items">
          <b-table-column label="Target" v-slot="props">
            <b-input v-model="props.row.name" />
          </b-table-column>
          <b-table-column label="Expectation" v-slot="props">
            <b-input v-model="props.row.expect" />
          </b-table-column>
          <b-table-column v-slot="props">
            <b-checkbox-button
              v-model="props.row.action"
              :native-value="true"
              type="is-primary"
              >Action</b-checkbox-button
            >
          </b-table-column>
          <b-table-column v-slot="props">
            <b-button
              @click="removeItem(checklist.items, props.row)"
              type="is-secondary"
              icon-right="close"
            />
          </b-table-column>
          <template #empty>
            Add Expectations, could be a verification or an action.
          </template>
        </b-table>
        <b-button @click="addItem(checklist.items)" type="is-primary"
          >Add an expectation</b-button
        >
      </b-tab-item>
    </b-tabs>
  </section>
</template>

<script>
export default {
  name: "AircraftDetailChecklists",
  props: {
    value: {
      default() {
        return [];
      }
    }
  },
  data() {
    return { currentList: undefined };
  },
  methods: {
    addList() {
      this.currentList =
        this.value.push({
          name: undefined,
          items: []
        }) - 1;
    },
    removeList(index) {
      this.currentList = index - 1;
      this.value.splice(index, 1);
    },
    addItem(items) {
      items.push({
        name: undefined,
        expect: undefined,
        action: false
      });
    },
    removeItem(items, item) {
      items.splice(items.indexOf(item), 1);
    }
  },
  watch: {
    value: {
      deep: true,
      handler(oldVal, newVal) {
        this.$emit("input", newVal);
      }
    }
  }
};
</script>
