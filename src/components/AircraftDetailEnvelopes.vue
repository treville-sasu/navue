<template>
  <section class="section">
    <div class="columns">
      <div class="column">
        <div v-for="(envelope, index) in envelopes" :key="index">
          <b-field label="Name" horizontal>
            <b-input v-model="envelope.name" />
            <div class="control">
              <b-button v-on:click="removeItem(envelopes, index)" icon-right="close" />
            </div>
          </b-field>

          <b-field v-for="(point, index) in envelope.values" :key="index" horizontal>
            <b-numberinput v-model="point.x" placeholder="arm" :controls="false" :step="0.001" />
            <b-numberinput v-model="point.y" placeholder="weight" :controls="false" :step="0.1" />
            <p class="control">
              <b-button v-on:click="removeItem(envelope.values, index)" icon-right="close" />
            </p>
          </b-field>
          <b-field>
            <b-button
              v-on:click="
                    appendItem(envelope.values, proto.envelopes[0].values[0])
                  "
              icon-right="plus"
              rounded
            />
          </b-field>
        </div>
        <b-button
          v-on:click="appendItem(envelopes, proto.envelopes[0])"
          type="is-primary"
          rounded
        >Add an envelope</b-button>
      </div>
      <div class="column">
        <BalanceChart :chartData="datasets" v-if="envelopes.length > 0" />
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss"></style>

<script>
import BalanceChart from "@/components/BalanceChart.vue";
import { TypeCasting, ChartSettings } from "@/mixins/apputils";

export default {
  name: "AircraftDetailEnvelopes",
  props: ["envelopes"],
  mixins: [TypeCasting, ChartSettings],
  components: { BalanceChart },
  computed: {
    datasets() {
      return {
        datasets: [
          ...this.envelopes.map(e => {
            return { ...this.envelopesDataset, label: e.name, data: e.values };
          })
        ]
      };
    }
  }
};
</script>
