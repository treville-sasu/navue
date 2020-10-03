// TODO: Fix alteration of proto, make a better copy.
export const TypeCasting = {
  data() {
    return {
      proto: {
        type: "aircraft",
        registration: null,
        manufacturer: null,
        model: null,
        paces: [
          {
            name: null,
            value: null,
            unit: "kt"
          }
        ],
        balance: {
          date: null,
          weights: [
            {
              name: null,
              arm: null,
              value: null,
              density: 1,
              min: null,
              max: null,
              tank: false
            }
          ]
        },
        envelopes: [
          {
            name: "New",
            values: [{ x: null, y: null }]
          }
        ],
        consumptions: [
          {
            name: null,
            value: null,
            volume: "L",
            unit: null
          }
        ],
        checklists: [
          {
            name: null,
            items: [
              {
                name: null,
                expect: null,
                action: false
              }
            ]
          }
        ]
      },
      location: {
        type: "location",
        latlng: { lat: null, lng: null },
        accuracy: null,
        timestamp: null,
        altitude: null,
        altitudeAccuracy: null,
        speed: null,
        heading: null

        // ...
      }
    };
  },
  methods: {
    removeItem(array, index) {
      array.splice(index, 1);
    },
    prependItem(array, proto) {
      array.unshift(JSON.parse(JSON.stringify(proto)));
    },
    appendItem(array, proto) {
      array.push(JSON.parse(JSON.stringify(proto)));
    }
  }
};
export const UnitSystem = {
  data() {
    return {
      units: {
        // speed: {
        //   "m/s": 1,
        //   "km/h": 3.6,
        //   "ft/min": 196.85,
        //   kt: 1.94384,
        //   // "Mach": 343, // changes with T° and Pressure
        //   mph: 2.23694
        // },
        consumptions: ["/h", "/1000ft", "each"],
        volume: {
          L: 1,
          "gal US": 0.264172,
          "gal Imp": 0.219969
        }
        // altitude: {
        //   m: 1,
        //   ft: 3.28084,
        //   FL: 328.084
        // },
        // distance: {
        //   m: 1,
        //   Km: 0.001,
        //   NM: 0.000539957,
        //   Mile: 0.000621371,
        //   Yard: 1.09361
        // }
      }
    };
  },
  filters: {
    // convert(value, kind, from, to) {
    //   return (value * this.units[kind][from]) / this.units[kind][to];
    // },
    asSpeed(value, to = "kt", from = "m/s") {
      let speed = {
        "m/s": 1,
        "km/h": 3.6,
        "ft/min": 196.85,
        kt: 1.94384,
        // "Mach": 343, // changes with T° and Pressure
        mph: 2.23694
      };
      return (value / speed[from]) * speed[to];
      // return this.convert(value, "speed", from, to)
    },
    asAltitude(value, to = "ft", from = "m") {
      let altitude = {
        m: 1,
        ft: 3.28084,
        FL: 328.084
      };
      return (value / altitude[from]) * altitude[to];
      // return this.convert(value, "altitude", from, to)
    },
    asDistance(value, to = "ft", from = "m") {
      let distance = {
        m: 1,
        Km: 0.001,
        NM: 0.000539957,
        Mile: 0.000621371,
        Yard: 1.09361
      };
      return (value / distance[from]) * distance[to];
      // return this.convert(value, "distance", from, to)
    },
    asHeading(value) {
      return (value + 360) % 360;
    },
    asDirection(value) {
      return ((value + 540) % 360) - 180;
    },
    asDuration(value) {
      if (value) {
        let date = new Date(value * 1000);
        return `${date.getUTCHours()}:${date.getUTCMinutes()}:${date.getSeconds()}`;
      } else return "-";
    },
    precision(value, precision = 2) {
      return (
        Math.round(value * 10 ** precision + Number.EPSILON) /
          10 ** precision || "-"
      );
    }
  }
};

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
    downloadJSON(data, fileName) {
      let fileToSave = new Blob([JSON.stringify(data, undefined, 2)], {
        type: "application/json",
        name: fileName
      });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(fileToSave);
      a.download = fileName;
      a.click();
    },
    uploadJSON(file) {
      // files.forEach(file => { // we only need single file upload for now
      let fr = new FileReader();
      fr.onload = txt => {
        this.aircraft = JSON.parse(txt.target.result);
      };
      fr.readAsText(file);
      // });
    }
  }
};
