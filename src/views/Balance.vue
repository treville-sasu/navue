<template>
  <section>
    <section class="hero is-primary is-hidden-mobile">
      <div class="hero-body">
        <h1 class="title">Weight & Balance</h1>
        <h2 class="subtitle">
          Here you can compute center of gravity and assert a correct margin
          within the aircraft limits
        </h2>
      </div>
    </section>
    <AircraftSelect v-if="!aircraft" select />
    <section class="section" v-else>
      <div class="columns">
        <div class="column">
          <div v-for="(weight, index) in aircraft.balance.weights" :key="index">
            <b-field :label="weight.name" horizontal expanded>
              <b-slider
                v-model="weight.value"
                :min="weight.min"
                :max="weight.max"
                :tooltip="false"
              />
              <p class="control">
                <b-tag type="is-dark">{{ weight.value }}</b-tag>
              </p>
            </b-field>
          </div>
        </div>
        <div class="column">
          <BalanceChart
            :chart-data="datasets"
            v-if="aircraft.envelopes.length > 0"
          />
        </div>
      </div>
    </section>
  </section>
</template>

<script>
import AircraftSelect from "@/components/AircraftSelect.vue";
import BalanceChart from "@/components/BalanceChart.vue";
import { ChartSettings } from "@/mixins/apputils";

export default {
  name: "Balance",
  components: {
    AircraftSelect,
    BalanceChart
  },
  mixins: [ChartSettings],
  methods: {
    getCenterGravity(weights) {
      let cg = weights.reduce(
        (acc, i) => {
          let weight = i.value * (i.densitiy || 1);
          return {
            x: acc.x + weight * i.arm,
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
      return this.getCenterGravity(this.aircraft.balance.weights);
    },
    cgEmptyTank() {
      return this.getCenterGravity(
        this.aircraft.balance.weights.filter(w => !w.tank)
      );
    },
    datasets() {
      return {
        datasets: [
          ...this.aircraft.envelopes.map(e => {
            return { ...this.envelopesDataset, label: e.name, data: e.values };
          }),
          { ...this.cgDataset, data: [this.cgFullTank], label: "Full tank" },
          { ...this.cgDataset, data: [this.cgEmptyTank], label: "Empty tank" }
        ]
      };
    }
  }
};
</script>
