<template>
  <section class="section">
    <section class="hero is-primary">
      <div class="hero-body">
        <div class="container">
          <h1 class="title">Weight & Balance</h1>
          <h2 class="subtitle">
            Here you can compute center of gravity and assert a correct margin
            within the aircraft limits
          </h2>
        </div>
      </div>
    </section>
    <div class="notification" v-if="!isBalanceable">
      Before anything you should select an aircraft with all parameters set.
      <AircraftSelect v-on:select="setAircraft" />
    </div>
    <div v-else class="columns">
      <div class="column is-centered">
        <h2 class="title">{{ aircraft.registration }}</h2>
        <div class="columns">
          <div class="column">
            <b-field v-for="(weight, index) in aircraft.balance.weights" :key="index">
              <b-field :label="weight.name" horizontal>
                <b-slider
                  v-model="weight.value"
                  :min="weight.min"
                  :max="weight.max || weight.value"
                  :disabled="weight.disabled"
                  :tooltip="false"
                  lazy
                ></b-slider>
                <b-tag type="is-dark">{{ weight.value }}</b-tag>
              </b-field>
            </b-field>
          </div>
          <div class="column">
            <BalanceChart :chartData="datasets" v-if="aircraft.envelopes.length > 0" />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import AircraftSelect from "@/components/AircraftSelect.vue";
import BalanceChart from "@/components/BalanceChart.vue";
import { ChartSettings } from "@/mixins/apputils";
import { mapState, mapMutations } from "vuex";

export default {
  name: "Balance",
  components: {
    AircraftSelect,
    BalanceChart
  },
  mixins: [ChartSettings],
  data() {
    return {
      aircraft: null
    };
  },
  mounted() {
    this.setAircraft(this.selectedAircraft);
  },
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
    },
    ...mapMutations(["selectAircraft"]),
    setAircraft(option) {
      this.aircraft = { ...option };
      this.aircraft.balance.weights.forEach(w => {
        if (w.value) w.disabled = true;
      });
    }
  },
  computed: {
    isBalanceable() {
      return (
        !!this.aircraft && !!this.aircraft.balance && !!this.aircraft.envelopes
      );
    },
    cgFullTank() {
      return this.getCenterGravity(this.aircraft.balance.weights);
    },
    cgEmptyTank() {
      return this.getCenterGravity(
        this.aircraft.balance.weights.filter(w => !w.tank)
      );
    },
    ...mapState(["selectedAircraft"]),
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
