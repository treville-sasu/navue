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
      object: undefined
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

      // borderColor: Utils.CHART_COLORS.orange,
      // backgroundColor: Utils.transparentize(Utils.CHART_COLORS.orange),
      // color

      Object.keys(opts).forEach(name => {
        if (opts[name] === undefined) delete opts[name];
      });

      return opts;
    }
  },
  watch: {
    data(n) {
      if (this.object) {
        this.object.data = n;
        this.object.update("none");
      }
    },
    options(n) {
      if (this.object) {
        this.object.options = n;
        this.object.update("none");
      }
    }
  },
  mounted() {
    this.object = new Chart(this.$el, this.curatedOptions);
  },
  render(h) {
    return h("canvas", { attrs: this.$attrs });
  },
  beforeDestroy() {
    this.object.destroy();
  }
};
</script>
