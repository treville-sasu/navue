<template>
  <section class="box">
    <div class="columns">
      <div class="column">
        <div
          v-if="balance.length == 0"
          class="notification is-primary"
          has-icon
        >
          At least one weight should be configured prior to use this tool.
          <router-link :to="{ name: 'Aircraft', hash: '#moments' }"
            >Set them before</router-link
          >
        </div>
        <b-field
          v-for="({ name, mass }, index) in moments"
          :label="name"
          :key="index"
          grouped
          horizontal
        >
          <b-slider
            v-model="mass.value"
            :min="mass.min"
            :max="mass.max"
            :custom-formatter="() => mass.toString()"
            :tooltip="false"
          />
          <p class="control">
            <b-tag>{{ mass }}</b-tag>
          </p>
        </b-field>
        <nav class="level">
          <div class="level-item has-text-centered">
            <div>
              <p class="heading">Total weight</p>
              <p class="title">{{ cgFullTank.mass }}</p>
            </div>
          </div>
          <div class="level-item has-text-centered">
            <div>
              <p class="heading">Mean Arm</p>
              <p class="title">{{ cgFullTank.lever }}</p>
            </div>
          </div>
        </nav>
      </div>
      <div class="column">
        <div
          v-if="envelopes.length == 0"
          class="notification is-primary"
          has-icon
        >
          At least one envelope should be configured prior to use this tool.
          <router-link :to="{ name: 'Aircraft', hash: '#envelops' }"
            >Go, and set some</router-link
          >
        </div>
        <BalanceChart :chart-data="datasets" v-else />
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
  computed: {
    balance() {
      return this.$store.state.currentAircraft.balance;
    },
    envelopes() {
      return this.$store.state.currentAircraft.envelopes;
    },
    cgFullTank() {
      return Moment.linearCoG(this.moments.items);
    },
    cgEmptyTank() {
      return Moment.linearCoG(this.moments.items.filter(w => !w.tank));
    },
    datasets() {
      return {
        datasets: [
          ...this.envelopes.items.map(e => {
            return {
              ...this.envelopesDataset,
              label: e.name,
              data: e.items.map(i => this.toCoords(i))
            };
          }),
          {
            ...this.cgDataset,
            data: [this.toCoords(this.cgFullTank)],
            label: "Full tank"
          },
          {
            ...this.cgDataset,
            data: [this.toCoords(this.cgEmptyTank)],
            label: "Empty tank"
          }
        ]
      };
    }
  },
  methods: {
    toCoords({ mass, lever }) {
      return { x: Number(lever), y: Number(mass) };
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
