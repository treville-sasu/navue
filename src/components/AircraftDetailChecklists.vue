<template>
  <section>
    <b-button @click="addList" type="is-primary">Add a list</b-button>
    <b-tabs v-model="activeTab" vertical>
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
              @click="removeItem(checklist, props.row)"
              type="is-secondary"
              icon-right="close"
            />
          </b-table-column>
          <template #empty>
            Add Expectations, could be a verification or an action.
          </template>
        </b-table>
        <b-button @click="addItem(checklist)" type="is-primary"
          >Add an expectation</b-button
        >
      </b-tab-item>
    </b-tabs>
  </section>
</template>

<script>
import { Store } from "@/models/Base.js";

export default {
  name: "AircraftDetailChecklists",
  props: {
    checklists: {
      default() {
        return [];
      }
    }
  },
  data() {
    return {
      activeTab: undefined,
      value: this.checklists
    };
  },
  methods: {
    addList() {
      //FIXME : on issue pops in tabs when adding a list.
      this.activeTab = this.value.add(
        new Store({
          name: undefined
        })
      );
    },
    removeList(index) {
      this.value.remove(undefined, index);
      this.activeTab = Math.max(index - 1, 0);
    },
    addItem(items) {
      items.add({
        name: undefined,
        expect: undefined,
        action: false
      });
    },
    removeItem(items, item) {
      items.remove(item);
    }
  },
  watch: {
    value: {
      deep: true,
      handler(val) {
        this.$emit("update:checklists", val);
      }
    }
  }
};
</script>
