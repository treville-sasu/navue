export default {
  methods: {
    proxyUrl(url) {
      return process.env.NODE_ENV != "production"
        ? "https://cors.treville.workers.dev/" + url
        : url;
    }
  }
};
