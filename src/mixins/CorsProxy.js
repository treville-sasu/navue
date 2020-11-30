export default {
  methods: {
    proxyUrl(url) {
      if (process.env.NODE_ENV == "production") return url;
      else if (url instanceof Request)
        return new Request("https://cors.treville.workers.dev/" + url.url, url);
      else if (url instanceof URL)
        return "https://cors.treville.workers.dev/" + url.href;
      else return "https://cors.treville.workers.dev/" + url;
    }
  }
};
