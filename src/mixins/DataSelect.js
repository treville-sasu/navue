import deepEqual from "deep-equal";
import { ImportExport, UIHelpers } from "@/mixins/apputils";

export const DataSelect = {
  mixins: [ImportExport, UIHelpers],
  props: {
    value: Object
  },
  data() {
    return {
      search: "",
      upload: []
    };
  },
  // mounted() {
  //   if (this.$route.params.id)
  //     this.getData(this.$route.params.id)
  //       .then(this.useData)
  //       .then(() => {
  //         this.$router.push({
  //           name: this.$route.name,
  //           params: {}
  //         });
  //       });
  //   else if (this.selectedData) this.useData(this.selectedData);
  // },
  computed: {
    isSaved() {
      return !this.value || deepEqual(this.selectedData, this.value);
    },
    fromDB() {
      return this.value && this.value._id && this.value._rev;
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
    // getData(id) {
    //   // TODO: Handle error with care ! in the whole app
    //   return this.$pouch.get(id).catch(console.error);
    // },
    useData(data) {
      this.selectedData = data;
      this.$emit("input", this.selectedData);
    },
    discardData() {
      this.useData(this.selectedData);
    },
    saveData() {
      this.$store
        .dispatch("saveToDB", {
          _id: `${this.dataType}-${Date.now()}`,
          ...this.value
        })
        .then(res => {
          this.useData({ ...this.value, _id: res.id, _rev: res.rev });
          this.openWarning("Saved");
        })
        .catch(err => {
          console.debug(err);
          this.openWarning(err);
        });
    },
    deleteData() {
      this.$store
        .dispatch("deleteFromDB", this.value)
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
      this.uploadJSON(file).then(res => {
        this.useData(this.cloneData(res));
      });
    },
    exportData() {
      if (this.value) this.downloadJSON(this.value, `${this.value.name}.json`);
    },
    cloneData(data) {
      // eslint-disable-next-line no-unused-vars
      const { _id, _rev, ...clone } = data;
      return clone;
    }
  }
};
