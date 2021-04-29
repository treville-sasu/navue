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
        this.$store.commit(this.storeKey, data);
      }
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
    createData() {
      this.selectedData = new this.constructor();
    },
    saveData() {
      this.$store
        .dispatch("saveToDB", this.selectedData)
        .then(data => {
          this.selectedData = data;
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
          this.selectedData = null;
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
          this.selectedData = this.cloneData(res);
          this.openWarning("Imported");
        })
        .catch(err => {
          console.error(err);
          this.openWarning(err);
        });
    },
    exportData() {
      if (this.selectedData)
        this.downloadJSON(
          this.selectedData,
          `${this.selectedData[this.searchedProperty]}.json`
        );
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
    }
  }
};
