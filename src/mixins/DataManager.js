import { ImportExport, UIHelpers } from "@/mixins/apputils";

export const DataManager = {
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
  methods: {
    useData(data) {
      this.selectedData = data;
      this.$emit("input", data);
    },
    saveData() {
      this.$store
        .dispatch("saveToDB", this.selectedData)
        .then(data => {
          this.useData(data);
          this.openWarning("Saved");
        })
        .catch(err => {
          console.error(err);
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
          console.error(err);
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
          console.error(err);
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
