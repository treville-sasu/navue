import { ImportExport, UIHelpers } from "@/mixins/apputils";

export const DataManager = {
  mixins: [ImportExport, UIHelpers],
  props: {
    create: Boolean,
    edit: Boolean,
    persistent: Boolean,
    exist: Boolean
  },
  data() {
    return {
      search: "",
      upload: []
    };
  },
  mounted() {
    if ((this.persistent || this.exist) && !this.selectedData)
      this.createData();
  },
  computed: {
    dataType() {
      return this.constructor.name;
    },
    fromDB() {
      return (
        this.selectedData && this.selectedData._id && this.selectedData._rev
      );
    },
    selectedData: {
      get() {
        return this.$store.state[this.storeKey];
      },
      set(data) {
        try {
          this.$store.commit(this.storeKey, data);
        } catch (err) {
          if (process.env.NODE_ENV == "development") console.error(err);
          this.$buefy.dialog.alert({
            title: "Cannot load item",
            message: `Selected record is corrupted. It will be purged from database. Do you want to download it localy before ?`,
            type: "is-danger",
            hasIcon: true,
            trapFocus: true,
            icon: "cloud-download-outline",
            confirmText: "Download & Delete",
            onConfirm: () => {
              this.downloadJSON(data, `navue-corrupted-item.json`);
            },
            canCancel: true,
            cancelText: "Just delete it"
          });
          this.$store.dispatch("deleteFromDB", data);
        }
      }
    },
    selectedName() {
      return this.selectedData
        ? this.selectedData[this.searchedProperty]
        : undefined;
    }
  },
  pouch: {
    availableData() {
      let selector = { type: this.dataType };
      selector[this.searchedProperty] = { $regex: RegExp(this.search, "i") };

      return {
        database: "navue",
        selector
      };
    }
  },
  methods: {
    createData(seed) {
      this.selectedData = new this.constructor(seed);
    },
    async saveData() {
      try {
        this.selectedData = await this.$store.dispatch(
          "saveToDB",
          this.selectedData
        );
        this.openWarning({ message: `"${this.selectedName}" saved` });
      } catch (err) {
        this.dispatchError(err);
      }
    },
    discardData() {
      this.selectedData = undefined;
    },
    async deleteData() {
      try {
        await this.$store.dispatch("deleteFromDB", this.selectedData);
        this.selectedData = null;
        this.openWarning({ message: `"${this.selectedName}" deleted` });
      } catch (err) {
        this.dispatchError(err);
      }
    },
    async importData(file) {
      try {
        let importedData = await this.uploadJSON(file);
        this.selectedData = this.cloneData(importedData);
        this.openWarning({ message: `"${this.selectedName}" imported` });
      } catch (err) {
        this.dispatchError(err);
      }
    },
    exportData() {
      if (this.selectedData)
        this.downloadJSON(this.selectedData, `${this.selectedName}.json`);
    },
    cloneData(data) {
      let clone = data.clone();
      delete clone._id;
      delete clone._rev;
      if (clone.name) clone.name += "-1";
      if (clone.registration) clone.registration += "(cloned)";
      return clone;
    },
    dispatchError(e) {
      console.error(e);
      this.openWarning(e);
    }
  }
};
