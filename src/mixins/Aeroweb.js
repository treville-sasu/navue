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
      return ["OPMET", "SIGMET"]; //, "VAA", "TCA", "MAA", "SW", "PREDEC"];
    },
    avaliableMaps() {
      return AerowebJS.CARTES;
    }
  },
  methods: {
    async getMessages({ codes, categories }) {
      return Promise.all(
        categories.map(async category => {
          try {
            return await this.aerowebInstance[category](
              codes.map(c => c.id || c)
            );
          } catch (err) {
            console.error(err);
            this.error = true;
          }
        })
      );
    },
    async getMaps({ zone, types, altitude }) {
      return Promise.all(
        types.map(async type => {
          try {
            return await this.aerowebInstance.CARTES(zone, type, altitude);
          } catch (err) {
            console.error(err);
            this.error = true;
          }
        })
      );
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
