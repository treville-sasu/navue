<script>
import Chart from "chart.js/auto";

export default {
  name: "ChartJs",
  props: {
    type: {
      type: String,
      required: true,
      validator: v =>
        [
          "bar",
          "line",
          "radar",
          "doughnut",
          "pie",
          "polarArea",
          "bubble",
          "scatter",
          "mixed"
        ].includes(v)
    },
    data: [Object, Array],
    options: Object,
    plugins: Array
  },
  data() {
    return {
      chart: undefined
    };
  },
  computed: {
    curatedOptions() {
      let opts = {
        type: this.type == "mixed" ? undefined : this.type,
        data: this.data,
        options: this.options,
        plugins: this.plugins
      };

      Object.keys(opts).forEach(name => {
        if (opts[name] === undefined) delete opts[name];
      });

      return opts;
    }
  },
  watch: {
    data(n) {
      if (this.chart) {
        this.chart.data = n;
        this.chart.update("none");
      }
    },
    options(n) {
      if (this.chart) {
        this.chart.options = n;
        this.chart.update("none");
      }
    }
  },
  mounted() {
    this.chart = new Chart(this.$el, this.curatedOptions);
    this.$emit("load", this.chart);
  },
  render(h) {
    return h("canvas", { attrs: this.$attrs });
  },
  beforeDestroy() {
    this.chart.destroy();
  }
};
</script>
