export default {
  data() {
    return {
      results: [],
      debounceTime: 1000,
      debounce: undefined,
      isLoading: false
    };
  },
  created() {
    if (this.$store.getters.assets(this.type))
      this.query = this.$store.getters.assets(this.type);
  },
  destroyed() {
    this.$store.commit("currentAssets", {
      type: this.type,
      query: this.query
    });
  },
  computed: {
    poi() {
      return this.$store.getters.pois; //.map(id => ({ id, name: id }));
    }
  },
  watch: {
    query: {
      deep: true,
      immediate: true,
      handler() {
        this.unbounce();
        this.debounce = setTimeout(this.search, this.debounceTime);
      }
    }
  },
  methods: {
    unbounce() {
      clearTimeout(this.debounce);
    }
  }
};
