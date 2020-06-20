export const editDetails = {
  data() {
    return {
      proto: {
        id: null,
        paces: [
          {
            name: null,
            values: [{ x: null, y: null }]
          }
        ],
        balance: {
          date: null,
          weights: [
            {
              name: null,
              arm: null,
              value: null,
              density: null,
              min: null,
              max: null
            }
          ]
        },
        envelopes: [{
          name: null,
          values: [{ x: null, y: null }]
        }],
        consumptions: [
          {
            name: null,
            unit: null,
            value: null
          }
        ]
      },
      units: {
        speed: ["m/s", "km/h", "ft/min", "kt", "Mach", "mph"],
        fuel: ["/h", "/1000ft", "each"]
      },
      envelopesDataset: {
        showLines: true,
        showLine: true,
        fill: "start",
        borderWidth: 2,
        pointRadius: 5,
        pointHoverRadius: 5,
        tension: 0
      }
    };
  },
  // TODO: Fix alteration of proto, make a better copy.
  methods: {
    removeItem(array, index) {
      array.splice(index, 1);
    },
    prependItem(array, proto) {
      array.unshift({ ...proto });
    },
    appendItem(array, proto) {
      array.push({ ...proto });
    }
  }
};
