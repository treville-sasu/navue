<template>
  <section class="box">
    <div class="columns">
      <div class="column">
        <b-field
          v-for="({ name, mass }, index) in moments"
          :label="name"
          :key="index"
          grouped
        >
          <b-slider
            v-model="mass.value"
            :min="mass.min"
            :max="mass.max"
            :custom-formatter="() => mass.toString()"
          />
        </b-field>
      </div>
      <div class="column">
        <BalanceChart :chart-data="datasets" v-if="envelopes.length > 0" />
      </div>
    </div>
  </section>
</template>

<script>
import BalanceChart from "@/components/BalanceChart";
import { ChartSettings } from "@/mixins/apputils";
import { Store } from "@/models/Base";
import { Moment } from "@/models/Moment";

export default {
  name: "Balance",
  components: {
    BalanceChart
  },
  mixins: [ChartSettings],
  data() {
    return { moments: new Store() };
  },
  methods: {
    getCenterGravity(moments) {
      let cg = moments.reduce(
        (acc, { mass, lever }) => {
          return {
            x: acc.x + mass * lever,
            y: acc.y + mass
          };
        },
        { x: 0, y: 0 }
      );
      cg.x = Math.round((cg.x / cg.y + Number.EPSILON) * 1000) / 1000;
      return cg;
    }
  },
  computed: {
    balance() {
      return this.$store.state.currentAircraft.balance;
    },
    envelopes() {
      return this.$store.state.currentAircraft.envelopes;
    },

    cgFullTank() {
      return this.getCenterGravity(this.moments.items);
    },
    cgEmptyTank() {
      return this.getCenterGravity(this.moments.items.filter(w => !w.tank));
    },
    datasets() {
      return {
        datasets: [
          ...this.envelopes.items.map(e => {
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
  },
  watch: {
    balance: {
      immediate: true,
      handler(val) {
        this.moments = Store.from(JSON.parse(JSON.stringify(val)), Moment);
      }
    }
  }
};
</script>
