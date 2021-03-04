<template>
  <section>
    <b-button @click="addEnvelope" type="is-primary">Add an envelope</b-button>
    <div class="columns">
      <div class="column">
        <b-tabs v-model="currentList" vertical>
          <b-tab-item
            v-for="(envelope, index) in value"
            :key="index"
            :value="`${index}`"
            :label="envelope.name || `${index + 1}`"
          >
            <b-field label="Name">
              <p class="control">
                <b-button @click="removeEnvelope(index)" icon-right="close" />
              </p>
              <b-input v-model="envelope.name" required />
            </b-field>
            <b-table :data="envelope.values">
              <b-table-column label="Arm" v-slot="props">
                <b-numberinput
                  :controls="false"
                  :step="0.001"
                  v-model="props.row.x"
                />
              </b-table-column>
              <b-table-column label="Mass" v-slot="props">
                <b-numberinput
                  :controls="false"
                  :step="0.001"
                  v-model="props.row.y"
                />
              </b-table-column>
              <b-table-column v-slot="props">
                <b-button
                  @click="removeItem(envelope.values, props.row)"
                  type="is-secondary"
                  icon-right="close"
                />
              </b-table-column>
              <template #empty>
                Add points with arm and mass to create an envelope.
              </template>
            </b-table>
            <b-button @click="addItem(envelope.values)" type="is-primary"
              >Add a point</b-button
            >
          </b-tab-item>
        </b-tabs>
      </div>
      <div class="column">
        <BalanceChart :chart-data="datasets" v-if="value.length > 0" />
      </div>
    </div>
  </section>
</template>

<script>
import BalanceChart from "@/components/BalanceChart.vue";
import { ChartSettings } from "@/mixins/apputils";

export default {
  name: "AircraftDetailEnvelopes",
  components: { BalanceChart },
  props: {
    value: {
      default() {
        return [
          {
            name: undefined,
            values: [{ x: undefined, y: undefined }]
          }
        ];
      }
    }
  },
  mixins: [ChartSettings],
  data() {
    return { currentList: undefined };
  },
  computed: {
    datasets() {
      return {
        datasets: [
          ...this.value.map(e => {
            return { ...this.envelopesDataset, label: e.name, data: e.values };
          })
        ]
      };
    }
  },
  methods: {
    addEnvelope() {
      this.currentList =
        this.value.push({
          name: undefined,
          values: []
        }) - 1;
    },
    removeEnvelope(index) {
      this.currentList = index - 1;
      this.value.splice(index, 1);
    },
    addItem(items) {
      items.push({
        x: undefined,
        y: undefined
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
