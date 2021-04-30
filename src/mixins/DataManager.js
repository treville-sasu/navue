import { ImportExport, UIHelpers } from "@/mixins/apputils";

export const DataManager = {
  mixins: [ImportExport, UIHelpers],
  props: {
    create: Boolean,
    edit: Boolean,
    persistent: Boolean
  },
  data() {
    return {
      search: "",
      upload: []
    };
  },
  mounted() {
    if (this.persistent) this.createData();
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
        let savedData = await this.$store.dispatch(
          "saveToDB",
          this.selectedData
        );
        this.selectedData = savedData;
        this.openWarning(`"${this.selectedName}" saved`);
      } catch (err) {
        this.dispatchError(err);
      }
    },
    async deleteData() {
      try {
        await this.$store.dispatch("deleteFromDB", this.selectedData);
        this.selectedData = null;
        this.openWarning(`"${this.selectedName}" deleted`);
      } catch (err) {
        this.dispatchError(err);
      }
    },
    async importData(file) {
      try {
        let importedData = await this.uploadJSON(file);
        this.selectedData = this.cloneData(importedData);
        this.openWarning(`"${this.selectedName}" imported`);
      } catch (err) {
        this.dispatchError(err);
      }
    },
    exportData() {
      if (this.selectedData)
        this.downloadJSON(this.selectedData, `${this.selectedName}.json`);
    },
    cloneData(data) {
      // function incrementString(str) {
      //   // Find the trailing number or it will match the empty string
      //   var count = str.match(/\d*$/);

      //   // Take the substring up until where the integer was matched
      //   // Concatenate it to the matched count incremented by 1
      //   return str.substr(0, count.index) + ++count[0];
      // }
      let clone = data.clone();
      delete clone._id;
      delete clone._rev;
      if (clone.name) clone.name += "-1";
      if (clone.registration) clone.registration += "(cloned)";
      return clone;
    },
    dispatchError(err) {
      console.error(err);
      this.openWarning(err);
    }
  }
};
