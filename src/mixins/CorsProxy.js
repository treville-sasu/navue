export default {
  methods: {
    proxyUrl(url) {
      const proxy_url = "https://cors.treville.workers.dev/";
      if (process.env.NODE_ENV == "production") return url;
      else if (url instanceof Request)
        return new Request(proxy_url + url.url, url);
      else if (url instanceof URL) return proxy_url + url.href;
      else
        return proxy_url + url.replace("https://notamweb", "http://notamweb");
    }
  }
};
