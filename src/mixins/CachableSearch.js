export default {
  data() {
    return {
      results: [],
      error: false,
      timeout: 1000,
      timer: undefined,
      isLoading: false
    };
  },
  created() {
    if (this.$store.state.currentQueries[this.type])
      this.query = this.$store.state.currentQueries[this.type];
  },
  computed: {
    poi() {
      return this.$store.getters.pois;
    }
  },
  watch: {
    query: {
      deep: true,
      immediate: true,
      handler() {
        if (!this.isLoading) {
          this.resetTimer();
          this.timer = setTimeout(this.triggerSearch, this.timeout);
        }
      }
    }
  },
  methods: {
    resetTimer() {
      clearTimeout(this.timer);
    },
    async triggerSearch() {
      this.isLoading = true;
      this.$store.commit("currentQueries", {
        [this.type]: this.query
      });
      try {
        this.results = await this.search();
        this.error = false;
      } catch (e) {
        this.error = true;
      }
      this.isLoading = false;
    }
  }
};
