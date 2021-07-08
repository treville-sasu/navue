const CreateFileWebpack = require("create-file-webpack");

process.env.VUE_APP_VERSION = require("./package.json").version;
process.env.VUE_APP_BUILD = require("child_process").execSync(
  "git describe --always --dirty"
);

module.exports = {
  outputDir: process.env.BUILD_DIR,
  devServer: {
    disableHostCheck: true,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
      "Access-Control-Allow-Headers":
        "X-Requested-With, content-type, Authorization"
    },
    https: true,
    open: true,
    openPage: ["index.html"]
  },

  pwa: {
    name: "naVue",
    workboxPluginMode: "InjectManifest",
    workboxOptions: {
      swSrc: "src/service-worker.js",
      exclude: ["CNAME", "robots.txt", /^.*map$/]
    },
    manifestPath: "navue.webmanifest",
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
    iconPaths: {
      msTileImage: "/img/icons/mstile-150x150.png"
    },
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
    screenshots: [
      {
        src: "azba-tablet-landscape.webp",
        sizes: "2048x1536",
        type: "image/webp"
      },
      {
        src: "fly-mobile-portrait.webp",
        sizes: "1131x2442",
        type: "image/webp"
      },
      {
        src: "azba-tablet-landscape.webp",
        sizes: "2048x1536",
        type: "image/webp"
      },
      {
        src: "balance-tablet-landscape.webp",
        sizes: "2048x1536",
        type: "image/webp"
      },
      {
        src: "brief-tablet-landscape.webp",
        sizes: "2048x1536",
        type: "image/webp"
      },
      {
        src: "metar-tablet-landscape.webp",
        sizes: "2048x1536",
        type: "image/webp"
      },
      {
        src: "notam-tablet-landscape.webp",
        sizes: "2048x1536",
        type: "image/webp"
      },
      {
        src: "fly-tablet-landscape.webp",
        sizes: "2048x1536",
        type: "image/webp"
      },
      {
        src: "temsi-tablet-landscape.webp",
        sizes: "2048x1536",
        type: "image/webp"
      },
      {
        src: "vac-tablet-landscape.webp",
        sizes: "2048x1536",
        type: "image/webp"
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
    },
    plugins: [
      new CreateFileWebpack({
        path: "./dist",
        fileName: ".git",
        content: "gitdir: ../.git/worktrees/dist"
      })
    ]
  },
  chainWebpack: config => {
    config.optimization.minimizer("terser").tap(args => {
      const { terserOptions } = args[0];
      terserOptions.keep_classnames = true;
      terserOptions.keep_fnames = true;
      return args;
    });
  },

  productionSourceMap: false
};
