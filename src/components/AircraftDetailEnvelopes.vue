<template>
  <section class="section">
    <b-field group-multiline>
      <template slot="label">
        Envelopes
        <b-tooltip type="is-dark" label="Create an envelope">
          <b-button
            v-on:click="prependItem(envelopes, proto.envelopes[0])"
            type="is-secondary"
            icon-right="plus"
          />
        </b-tooltip>
      </template>
      <div class="control">
        <b-field v-for="(envelope, index) in envelopes" :key="index">
          <p class="control">
            <b-tooltip type="is-dark" label="Remove this envelope">
              <b-button
                v-on:click="removeItem(envelopes, index)"
                type="is-secondary"
                icon-right="close"
              />
            </b-tooltip>
          </p>
          <b-field label="Name" label-position="on-border">
            <div class="control">
              <b-input v-model="envelope.name" />
              <b-field
                v-for="(point, index) in envelope.values"
                :key="index"
                grouped
              >
                <b-numberinput
                  v-model="point.x"
                  placeholder="arm"
                  :controls="false"
                  :step="0.001"
                />
                <b-numberinput
                  v-model="point.y"
                  placeholder="weight"
                  :controls="false"
                  :step="0.1"
                />
                <p class="control">
                  <b-tooltip type="is-dark" label="Remove this point">
                    <b-button
                      v-on:click="removeItem(envelope.values, index)"
                      type="is-secondaary"
                      icon-right="close"
                    />
                  </b-tooltip>
                </p>
              </b-field>
              <b-tooltip type="is-dark" label="Add a point">
                <b-button
                  v-on:click="
                    appendItem(envelope.values, proto.envelopes[0].values[0])
                  "
                  type="is-secondary"
                  icon-right="plus"
                />
              </b-tooltip>
            </div>
          </b-field>
        </b-field>
      </div>
    </b-field>
    <BalanceChart
      :chartData="BuildDataset(envelopes)"
      v-if="envelopes.length > 0"
    />
  </section>
</template>

<style scoped lang="scss"></style>

<script>
import BalanceChart from "@/components/BalanceChart.vue";
import { editDetails } from "@/mixins/casting";

export default {
  name: "AircraftDetailEnvelopes",
  props: ["envelopes"],
  mixins: [editDetails],
  components: { BalanceChart },
  methods: {
    BuildDataset(envlps) {
      return {
        datasets: envlps.map((e) =>
          Object.assign(
            { label: e.name, data: e.values },
            this.envelopesDataset
          )
        ),
      };
    },
  },
};
</script>
