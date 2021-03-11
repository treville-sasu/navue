import { ImportExport, UIHelpers } from "@/mixins/apputils";

export const DataSelect = {
  mixins: [ImportExport, UIHelpers],
  data() {
    return {
      search: "",
      upload: []
    };
  },
  computed: {
    fromDB() {
      return (
        this.selectedData && this.selectedData._id && this.selectedData._rev
      );
    }
  },
  pouch: {
    availableData() {
      return {
        database: "navue",
        selector: {
          type: this.dataType,
          registration: { $regex: RegExp(this.search, "i") }
        }
      };
    }
  },
  methods: {
    useData(data) {
      this.selectedData = data;
      this.$emit("input", data);
    },
    saveData() {
      this.$store
        .dispatch("saveToDB", {
          _id: `${this.dataType}-${Date.now()}`,
          ...this.selectedData
        })
        .then(res => {
          this.useData({ ...this.selectedData, _id: res.id, _rev: res.rev });
          this.openWarning("Saved");
        })
        .catch(err => {
          console.debug(err);
          this.openWarning(err);
        });
    },
    deleteData() {
      this.$store
        .dispatch("deleteFromDB", this.selectedData)
        .then(() => {
          this.useData(null);
          this.openWarning("Deleted");
        })
        .catch(err => {
          console.debug(err);
          this.openWarning(err);
        });
    },
    importData(file) {
      this.uploadJSON(file)
        .then(res => {
          this.useData(this.cloneData(res));
          this.openWarning("Imported");
        })
        .catch(err => {
          console.debug(err);
          this.openWarning(err);
        });
    },
    exportData() {
      if (this.selectedData)
        this.downloadJSON(this.selectedData, `${this.selectedData.name}.json`);
    },
    cloneData(data) {
      // eslint-disable-next-line no-unused-vars
      const { _id, _rev, ...clone } = data;
      return clone;
    }
  }
};
