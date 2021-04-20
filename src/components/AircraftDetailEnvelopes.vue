<template>
  <section>
    <b-button @click="addEnvelope" type="is-primary">Add an envelope</b-button>
    <div class="columns">
      <div class="column">
        <b-tabs v-model="activeTab" vertical>
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
            <b-table :data="envelope.items">
              <b-table-column label="Arm" v-slot="props">
                <b-field>
                  <b-numberinput
                    v-model="props.row.mass.value"
                    :step="0.001"
                    :controls="false"
                  />
                  <b-select v-model="props.row.mass.unit" required>
                    <option
                      v-for="(ratio, name) in props.row.mass.constructor.units"
                      :value="name"
                      :key="name"
                    >
                      {{ name }}
                    </option>
                  </b-select>
                </b-field>
              </b-table-column>
              <b-table-column label="Mass" v-slot="props">
                <b-field>
                  <b-numberinput
                    v-model="props.row.lever.value"
                    :controls="false"
                  />
                  <b-select v-model="props.row.lever.unit" required>
                    <option
                      v-for="(ratio, name) in props.row.lever.constructor.units"
                      :value="name"
                      :key="name"
                    >
                      {{ name }}
                    </option>
                  </b-select>
                </b-field>
              </b-table-column>
              <b-table-column v-slot="props">
                <b-button
                  @click="removeItem(envelope, props.row)"
                  type="is-secondary"
                  icon-right="close"
                />
              </b-table-column>
              <template #empty>
                Add points with arm and mass to create an envelope.
              </template>
            </b-table>
            <b-button @click="addItem(envelope)" type="is-primary"
              >Add a point</b-button
            >
          </b-tab-item>
        </b-tabs>
      </div>
      <div class="column">
        <BalanceChart
          :data="value"
          :chart-data="datasets"
          v-if="value.length > 0"
        />
      </div>
    </div>
  </section>
</template>

<script>
import BalanceChart from "@/components/BalanceChart.vue";
import { ChartSettings } from "@/mixins/apputils";

import { Store } from "@/models/Base.js";
import { Moment } from "@/models/Aircraft.js";

export default {
  name: "AircraftDetailEnvelopes",
  components: { BalanceChart },
  props: ["value"],
  mixins: [ChartSettings],
  data() {
    return { activeTab: undefined };
  },
  computed: {
    datasets() {
      return {
        datasets: [
          ...this.value.items.map(e => {
            return {
              ...this.envelopesDataset,
              label: e.name,
              data: e.items.map(i => {
                return { x: i.lever.value, y: i.mass.value };
              })
            };
          })
        ]
      };
    }
  },
  methods: {
    addEnvelope() {
      //FIXME : an erro pops in tabs when adding an envelope.
      this.activeTab = this.value.add(new Store({ name: undefined })) - 1;
    },
    removeEnvelope(index) {
      this.value.remove(undefined, index);
      this.activeTab = index - 1;
    },
    addItem(envelope) {
      envelope.add(new Moment());
    },
    removeItem(items, item) {
      items.remove(item);
    }
  },
  watch: {
    value: {
      deep: true,
      handler(val) {
        this.$emit("input", val);
      }
    }
  }
};
</script>
