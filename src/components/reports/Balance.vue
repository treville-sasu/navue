<template>
  <section class="box">
    <div class="columns" v-if="aircraft">
      <div class="column">
        <b-field
          :label="weight.name"
          v-for="(weight, index) in aircraft.balance"
          :key="index"
          grouped
        >
          <b-slider
            v-model="weight.value"
            :min="weight.min"
            :max="weight.max"
            :tooltip="false"
          />
          <p class="control">
            <b-tag type="is-dark">{{ weight }}</b-tag>
          </p>
        </b-field>
      </div>
      <div class="column">
        <BalanceChart
          :chart-data="datasets"
          v-if="aircraft.envelopes.length > 0"
        />
      </div>
    </div>
  </section>
</template>

<script>
import BalanceChart from "@/components/BalanceChart.vue";
import { ChartSettings } from "@/mixins/apputils";

export default {
  name: "Balance",
  components: {
    BalanceChart
  },
  mixins: [ChartSettings],
  methods: {
    getCenterGravity(weights) {
      let cg = weights.reduce(
        (acc, w) => {
          let weight = w.value * (w.densitiy || 1);
          return {
            x: acc.x + weight * w.arm,
            y: acc.y + weight
          };
        },
        { x: 0, y: 0 }
      );
      cg.x = Math.round((cg.x / cg.y + Number.EPSILON) * 1000) / 1000;
      return cg;
    }
  },
  computed: {
    aircraft() {
      return this.$store.state.currentAircraft;
    },
    cgFullTank() {
      return this.getCenterGravity(this.aircraft.balance.items);
    },
    cgEmptyTank() {
      return this.getCenterGravity(
        this.aircraft.balance.items.filter(w => !w.tank)
      );
    },
    datasets() {
      return {
        datasets: [
          ...this.aircraft.envelopes.items.map(e => {
            return {
              ...this.envelopesDataset,
              label: e.name,
              data: e.items.map(i => i.toCoords())
            };
          }),
          { ...this.cgDataset, data: [this.cgFullTank], label: "Full tank" },
          { ...this.cgDataset, data: [this.cgEmptyTank], label: "Empty tank" }
        ]
      };
    }
  }
};
</script>
