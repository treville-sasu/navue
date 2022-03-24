const CreateFileWebpack = require("create-file-webpack");
const SymlinkWebpackPlugin = require("symlink-webpack-plugin");

process.env.VUE_APP_VERSION = require("./package.json").version;
process.env.VUE_APP_BUILD = require("child_process").execSync(
  "git describe --always --dirty"
);

module.exports = {
  outputDir: process.env.BUILD_DIR,
  devServer: {
    https: true,
    open: true
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
    appleMobileWebAppCapable: "yes",
    appleMobileWebAppStatusBarStyle: "black",
    manifestOptions: {
      background_color: "#34495e",
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
      shortcuts: [
        {
          name: "Briefing Room",
          short_name: "Brief",
          description:
            "Trace routes, check weather & aeronautical informations.",
          url: "/brief"
        },
        {
          name: "Fly",
          description:
            "Fly with a moving map & aeronautical data, charts & weather, share your position with friends",
          url: "/fly"
        },
        {
          name: "Preflight report",
          description: "Check weather & aeronautical informations at a glance.",
          url: "/preflight"
        }
        // {
        //   name: "Debriefing",
        //   short_name: "Debriefing",
        //   description:
        //     "Debrief your flight, check position accuracy on maps, speed and altitude on graphs",
        //   url: "/debrief"
        // },
        // {
        //   name: "Monitor flight",
        //   short_name: "Monitor",
        //   description: "Monitor real time aircrafts position from friends or club",
        //   url: "/monitor"
        // }
      ],
      screenshots: [
        {
          src: "img/screenshots/azba-tablet-landscape.webp",
          sizes: "2048x1536",
          type: "image/webp"
        },
        {
          src: "img/screenshots/fly-mobile-portrait.webp",
          sizes: "1131x2442",
          type: "image/webp"
        },
        {
          src: "img/screenshots/azba-tablet-landscape.webp",
          sizes: "2048x1536",
          type: "image/webp"
        },
        {
          src: "img/screenshots/balance-tablet-landscape.webp",
          sizes: "2048x1536",
          type: "image/webp"
        },
        {
          src: "img/screenshots/brief-tablet-landscape.webp",
          sizes: "2048x1536",
          type: "image/webp"
        },
        {
          src: "img/screenshots/metar-tablet-landscape.webp",
          sizes: "2048x1536",
          type: "image/webp"
        },
        {
          src: "img/screenshots/notam-tablet-landscape.webp",
          sizes: "2048x1536",
          type: "image/webp"
        },
        {
          src: "img/screenshots/fly-tablet-landscape.webp",
          sizes: "2052x1540",
          type: "image/webp"
        },
        {
          src: "img/screenshots/temsi-tablet-landscape.webp",
          sizes: "2048x1536",
          type: "image/webp"
        },
        {
          src: "img/screenshots/vac-tablet-landscape.webp",
          sizes: "2048x1536",
          type: "image/webp"
        }
      ]
    }
  },

  configureWebpack: {
    resolve: {
      symlinks: false
    },
    plugins: [
      new CreateFileWebpack({
        path: "./dist",
        fileName: ".git",
        content: "gitdir: ../.git/worktrees/dist"
      }),
      new SymlinkWebpackPlugin({ origin: "index.html", symlink: "404.html" })
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
