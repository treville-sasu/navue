module.exports = {
  devServer: {
    disableHostCheck: true,
    public: "localhost:8080",
    https: true,
    open: true,
    openPage: ["index.html"]
  },

  pwa: {
    name: "naVue",
    workboxPluginMode: "InjectManifest",
    workboxOptions: {
      swSrc: "src/service-worker.js"
    },
    themeColor: "#34495e",
    msTileColor: "#34495e",
    manifestOptions: {
      background_color: "#34495e"
    },
    appleMobileWebAppCapable: "yes",
    appleMobileWebAppStatusBarStyle: "black",
    display: "fullscreen",
    scope: "/",
    start_url: "/",
    icons: [
      {
        src: "/img/icons/android-chrome-192x192.png",
        sizes: "192x192",
        type: "image/png"
      },
      {
        src: "/img/icons/android-chrome-512x512.png",
        sizes: "512x512",
        type: "image/png"
      }
    ],
    splash_pages: null
  },

  configureWebpack: {
    resolve: {
      symlinks: false
    },
    externals: {
      L: "leaflet"
    }
  },

  productionSourceMap: false
};
