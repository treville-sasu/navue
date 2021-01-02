import AerowebJS from "aeroweb";

export default {
  data() {
    return {
      aerowebInstance: new AerowebJS(process.env.VUE_APP_AEROWEB_CODE)
    };
  },
  computed: {
    avaliableCodes() {
      return [
        ...Array.from(
          Object.entries({
            ...AerowebJS.VAA,
            ...AerowebJS.TCA,
            ...AerowebJS.PREDEC
          }),
          station => {
            return { id: station[0], name: station[1], type: "weather" };
          }
        ),
        ...require("@/store/vac.json")
      ];
    },
    avaliableCategories() {
      return ["OPMET", "SIGMET"]; // ["OPMET", "SIGMET", "VAA", "TCA", "MAA", "SW", "PREDEC"];
    },
    avaliableMaps() {
      return AerowebJS.CARTES;
    }
  },
  methods: {
    async getMessages(codes, categories) {
      (categories || this.searchCategories).forEach(async category => {
        try {
          const data = await this.aerowebInstance[category](
            codes.map(c => c.id || c)
          );
          this.$set(this.resultsMessages, category, data);
        } catch (err) {
          console.error(err);
          this.error = true;
          delete this.resultsMessages[category];
        }
      });
    },
    async getMaps(zone, types) {
      (types || this.searchTypes).forEach(async type => {
        try {
          const data = await this.aerowebInstance.CARTES(
            zone || this.searchZone,
            type
          );
          this.$set(this.resultsMaps, type, data);
        } catch (err) {
          console.error(err);
          this.error = true;
          delete this.resultsMaps[type];
        }
      });
    },
    groupByAttribute(xs, attribute, key_callback) {
      return xs.reduce((rv, x) => {
        if (x)
          (rv[x[attribute]] = rv[x[attribute]] || []).push(
            key_callback.call(null, x)
          );
        return rv;
      }, {});
    }
  }
};
