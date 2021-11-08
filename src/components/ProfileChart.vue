<template>
  <div>
    <chart-js
      @load="chart = $event"
      type="line"
      :data="data"
      :options="options"
    />
  </div>
</template>

<script>
import ChartJs from "@/components/ChartJs";
import "chartjs-adapter-date-fns";

import c from "@/assets/colors.scss";

export default {
  components: { ChartJs },
  props: ["geojson"],
  inject: ["mxMap"],
  data() {
    return {
      chart: undefined,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          mode: "index",
          intersect: false
        },
        // stacked: false,
        onHover: this.updateCursor,
        onLeave: () => this.updateCursor(undefined),
        tension: 0.5,
        parsing: {
          xAxisKey: "timestamp"
        },
        scales: {
          x: {
            type: "time",
            time: {
              unit: "minute"
            }
          },
          elevation: {
            type: "linear",
            position: "left"
          },
          speed: {
            type: "linear",
            position: "right"
            // grid: { drawOnChartArea: false }
          }
        },
        elements: {
          line: {
            backgroundColor: [
              c["primaryFade"],
              c["successFade"],
              c["infoFade"],
              c["warningFade"]
            ],
            borderColor: [c["primary"], c["success"], c["info"], c["warning"]]
          },
          point: {
            radius: 0
          }
        },
        plugins: {
          legend: {
            position: "top"
            // labels: {
            //   usePointStyle: true,
            //   pointStyle: "rectRounded"
            // }
          },
          decimation: {
            enabled: true,
            algorithm: "lttb"
          },
          tooltip: {
            callbacks: {
              label: function({
                parsed: { y },
                dataset: {
                  label,
                  parsing: { yAxisKey }
                },
                raw
              }) {
                if (label) label += ": ";
                if (y !== null)
                  label += String(raw[yAxisKey.replace(".value", "")]);

                return label;
              }
            }
          }
        }
      }
    };
  },
  computed: {
    properties() {
      return this.geojson.map(({ properties }) => properties);
    },
    labels() {
      return this.geojson.map(({ properties }) => properties.timestamp);
    },
    data() {
      return {
        datasets: [
          {
            label: "Terrain",
            data: this.properties,
            yAxisID: "elevation",
            parsing: {
              xAxisKey: "timestamp",
              yAxisKey: "elevation.value"
            }
          },
          {
            label: "Altitude",
            data: this.properties,
            yAxisID: "elevation",
            parsing: {
              xAxisKey: "timestamp",
              yAxisKey: "altitude.value"
            }
          },
          {
            label: "Ground Speed",
            data: this.properties,
            yAxisID: "speed",
            parsing: {
              xAxisKey: "timestamp",
              yAxisKey: "speed.value"
            }
          },
          {
            label: "Vertical Speed",
            data: this.properties,
            yAxisID: "speed",
            parsing: {
              xAxisKey: "timestamp",
              yAxisKey: "verticalSpeed.value"
            }
          }
        ]
        // labels: this.labels
      };
    }
  },
  methods: {
    // updateCursor(_, index) {
    updateCursor(_, [{ index } = {}] = []) {
      this.$emit("update:cursor", index);
    },
    updateTooltip(chart, index) {
      chart.setActiveElements([
        {
          datasetIndex: 0,
          index
        }
      ]);
      chart.update();
    }
  }
};
</script>
