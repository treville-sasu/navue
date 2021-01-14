export const ChartSettings = {
  data() {
    return {
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
    openWarning(message, actionText, onAction) {
      this.$buefy.snackbar.open({
        message,
        position: "is-bottom",
        type: "is-danger",
        duration: 5000,
        actionText,
        onAction
      });
    }
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
    this.requestWakeLock();
    document.addEventListener("visibilitychange", this.requestWakeLock);
  },
  beforeDestroy() {
    document.removeEventListener("visibilitychange", this.requestWakeLock);
    if (this.wakeLock) this.wakeLock.release();
  },
  methods: {
    async requestWakeLock() {
      try {
        if ("wakeLock" in navigator && document.visibilityState === "visible") {
          this.wakeLock = await navigator.wakeLock.request("screen");
        } else throw "WakeLock unavaliable";
      } catch (err) {
        this.openWarning(err);
      }
    }
  }
};
