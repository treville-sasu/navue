// TODO: Fix alteration of proto, make a better copy.
export const TypeCasting = {
  data() {
    return {
      proto: {
        registration: null,
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
        //TODO add conversion value.
        speed: {
          "m/s": 1,
          "km/h": 0.277778,
          "ft/min": 18.288,
          "kt": 0.514444,
          // "Mach": 343, // changes with T° and Pressure
          "mph": 0.44704
        },
        consumptions: ["/h", "/1000ft", "each"],
        volume: {
          "L": 1,
          "gal US": 3.78541,
          "gal Imp": 4.54609
        },
        altitude: {
          "m": 1,
          "ft": 0.3048,
          "FL": 30.48
        },
        distance: {
          "m": 1,
          "Km": 1000,
          "NM": 1852,
          "Mile": 1609.34,
          "Yard": 0.9143977272588
        }
      }
    };
  },
  methods: {
    // convert(value, from, to) {
    //   return value / this.units.fuel[from] * this.units.consumptions[to]
    // }
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
