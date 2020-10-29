import { ImportExport } from "@/mixins/apputils";

export const DataSelect = {
  mixins: [ImportExport],
  props: {
    value: Object,
    required: Boolean,
  },
  data() {
    return {
      search: "",
      upload: [],
    };
  },
  beforeMount() {
    this.activated = false;
  },
  beforeDestroy() {
    this.activated = null;
  },
  mounted() {
    if (this.$route.params.id)
      this.getData(this.$route.params.id)
        .then(this.useData)
        .then(() => {
          this.$router.push({
            name: this.$route.name,
            params: {},
          });
        });
    else if (this.selectedData) this.useData(this.selectedData);
  },
  methods: {
    getData(id) {
      return this.$pouch.get(id).catch(console.error);
    },
    saveData(data) {
      this.$pouch
        .put({
          _id: `${this.dataType}-${Date.now()}`,
          ...data,
        })
        .catch(console.error)
        .then((res) => {
          this.useData({ ...data, _id: res.id, _rev: res.rev });
        });
    },
    useData(e) {
      this.selectedData = e;
      this.activated = false;
      this.$emit("update");
      this.$emit("input", e);
    },
    deleteData() {
      this.$pouch
        .remove(this.value)
        .then(() => {
          this.useData(null);
        })
        .catch(console.error);
    },
    importData(file) {
      this.uploadJSON(file).then((res) => {
        this.useData(this.cloneData(res));
      });
    },
    exportData() {
      if (this.value) this.downloadJSON(this.value, `${this.value.name}.json`);
    },
    cloneData(data) {
      delete data._id;
      delete data._rev;
      return data
    }
  },
  computed: {
    openModal: {
      get() {
        return (this.required && this.value === null) || this.activated;
      },
      set(val) {
        this.activated = val;
      },
    },
    isFromDB() {
      return !!(this.value && this.value._id && this.value._rev);
    },
  },
};