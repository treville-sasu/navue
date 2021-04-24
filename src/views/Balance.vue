<template>
  <section>
    <section class="hero is-primary is-hidden-mobile">
      <div class="hero-body">
        <h1 class="title">Weight & Balance</h1>
        <h2 class="subtitle">
          Here you can compute center of gravity and assert a correct margin
          within the aircraft limits
        </h2>
        <div class="notification is-warning">
          Do not USE, do not work for tanks
        </div>
      </div>
    </section>
    <section class="section">
      <AircraftManager />
      <div class="columns" v-if="aircraft">
        <div class="column">
          <div v-for="(weight, index) in aircraft.balance" :key="index">
            <b-field :label="weight.name" horizontal expanded>
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
import AircraftManager from "@/components/AircraftManager.vue";
import BalanceChart from "@/components/BalanceChart.vue";
import { ChartSettings } from "@/mixins/apputils";

export default {
  name: "Balance",
  components: {
    AircraftManager,
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
