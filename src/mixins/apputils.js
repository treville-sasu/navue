import c from "@/assets/colors.scss";

export const ChartSettings = {
  data() {
    return {
      chartOptions: {
        elements: {
          line: {
            backgroundColor: [
              c["primaryFade"],
              c["successFade"],
              c["infoFade"],
              c["warningFade"]
            ],
            borderColor: [c["primary"], c["success"], c["info"], c["warning"]],
            color: [c["primary"], c["success"], c["info"], c["warning"]]
          }
        }
      },
      envelopesDataset: {
        showLines: true,
        showLine: true,
        fill: "start",
        borderWidth: 2,
        pointRadius: 5,
        pointHoverRadius: 5,
        tension: 0
      },
      cgDataset: {
        borderWidth: 2,
        pointRadius: 5,
        pointHoverRadius: 5
      }
    };
  }
};

export const ImportExport = {
  methods: {
    readTextFileAsync(file) {
      return new Promise((resolve, reject) => {
        let reader = new FileReader();
        reader.onload = () => {
          resolve(reader.result);
        };
        reader.onerror = reject;
        reader.readAsText(file);
      });
    },
    downloadJSON(data, fileName) {
      let file = new Blob([JSON.stringify(data, undefined, 2)], {
        type: "application/json",
        name: fileName
      });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(file);
      a.download = fileName;
      a.click();
    },
    async uploadJSON(file) {
      let data;
      // files.forEach(file => { // we only need single file upload for now
      data = JSON.parse(await this.readTextFileAsync(file));
      // });
      return data;
    }
  }
};

export const UIHelpers = {
  methods: {
    openWarning(content) {
      return this.$buefy.snackbar.open({
        position: "is-bottom",
        type: "is-danger",
        duration: 5000,
        queue: false,
        ...content
      });
    },
    confirmAction(content) {
      return this.$buefy.dialog.confirm({
        type: "is-danger",
        hasIcon: true,
        ...content
      });
    }
    // openToast(content) {
    //   return this.$buefy.toast.open({
    //     type: "is-danger",
    //     position: "is-top",
    //     duration: 2000,
    //     ...content
    //   });
    // }
  }
};

export const WakeLock = {
  data() {
    return {
      wakeLock: null
    };
  },
  mixins: [UIHelpers],
  mounted() {
    if ("wakeLock" in navigator) {
      this.requestWakeLock();
      document.addEventListener("visibilitychange", this.requestWakeLock);
    }
  },
  beforeDestroy() {
    if ("wakeLock" in navigator) {
      document.removeEventListener("visibilitychange", this.requestWakeLock);
      if (this.wakeLock) this.wakeLock.release();
    }
  },
  methods: {
    async requestWakeLock() {
      if (document.visibilityState === "visible")
        this.wakeLock = await navigator.wakeLock.request("screen");
    }
  }
};
