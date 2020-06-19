<style scoped lang="scss"></style>

<script>
// TODO: make data update live
import { Scatter, mixins } from "vue-chartjs";
import "chartjs-plugin-colorschemes";

export default {
  extends: Scatter,
  mixins: [mixins.reactiveProp],
  props: ["options"],
  // props: {
  //   options: {
  //     type: Object,
  //     default: () => ({
  //       responsive: true,
  //       maintainAspectRatio: false,
  //       plugins: {
  //         colorschemes: {
  //           scheme: "tableau.Tableau10",
  //         },
  //       },
  //     }),
  //   },
  // },
  mounted() {
    this.renderChart(this.chartData, this.options);
  }
  // watch: {
  //   chartData: () => {
  //     this.$data._chart.update();
  //   },
  // },
  // computed: {
  //   fullDataset() {
  //     return {
  //       datasets: [
  //         ...this.chartData.cgs.map((cg) => ({
  //           // ...this.cgs.map((cg) => ({
  //           label: cg.name,
  //           data: cg.values,
  //           borderWidth: 2,
  //           pointRadius: 5,
  //         })),
  //         ...this.chartData.limits.map((l) => ({
  //           // ...this.limits.map((l) => ({
  //           label: l.name,
  //           data: l.values,
  //           showLines: true,
  //           showLine: true,
  //           fill: "start",
  //           borderWidth: 2,
  //           pointRadius: 5,
  //           pointHoverRadius: 5,
  //           tension: 0,
  //         })),
  //       ],
  //     };
  //   },
  // },
};
</script>
