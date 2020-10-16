<template>
  <section>
    <b-button
      @click="value.unshift(JSON.parse(JSON.stringify(proto)))"
      type="is-primary"
      rounded
      >Add an envelope</b-button
    >
    <div class="columns">
      <div class="column">
        <div v-for="(envelope, index) in value" :key="index">
          <b-field label="Name" horizontal>
            <b-input v-model="envelope.name" />
            <div class="control">
              <b-button @click="value.splice(index, 1)" icon-right="close" />
            </div>
          </b-field>

          <b-field
            v-for="(point, index) in envelope.values"
            :key="index"
            horizontal
          >
            <b-numberinput
              v-model="point.x"
              placeholder="arm"
              :controls="false"
              :step="0.001"
            />
            <b-numberinput
              v-model="point.y"
              placeholder="mass"
              :controls="false"
              :step="0.1"
            />
            <p class="control">
              <b-button
                @click="envelope.values.splice(index, 1)"
                icon-right="close"
              />
            </p>
          </b-field>
          <b-field>
            <b-button
              @click="
                envelope.values.unshift(JSON.parse(JSON.stringify(proto_item)))
              "
              icon-right="plus"
              type="is-primary"
              rounded
            />
          </b-field>
        </div>
      </div>
      <div class="column">
        <BalanceChart :chart-data="datasets" v-if="value.length > 0" />
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss"></style>

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
            values: [{ x: undefined, y: undefined }],
          },
        ];
      },
    },
  },
  mixins: [ChartSettings],
  data() {
    return {
      proto: {
        name: undefined,
        values: [{ ...this.proto_item }],
      },
      proto_item: { x: undefined, y: undefined },
    };
  },
  watch: {
    value: {
      deep: true,
      handler(oldVal, newVal) {
        this.$emit("input", newVal);
      },
    },
  },
  computed: {
    datasets() {
      return {
        datasets: [
          ...this.value.map((e) => {
            return { ...this.envelopesDataset, label: e.name, data: e.values };
          }),
        ],
      };
    },
  },
};
</script>
