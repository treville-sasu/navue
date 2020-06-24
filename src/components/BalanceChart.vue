<script>
import { Scatter, mixins } from "vue-chartjs";
import "chartjs-plugin-colorschemes";

export default {
  extends: Scatter,
  mixins: [mixins.reactiveProp],
  props: ["chartdata", "options"],
  mounted() {
    this.renderChart(this.chartData, this.options);
  }
};
</script>
