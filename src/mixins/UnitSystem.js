export default {
  data() {
    return {
      quantities: {
        speed: {
          "m/s": 1,
          "km/h": 3.6,
          "ft/min": 196.85,
          kt: 1.94384,
          // "Mach": 343, // changes with T° and Pressure
          mph: 2.23694
        },
        volume: {
          L: 1,
          "gal US": 0.264172,
          "gal Imp": 0.219969
        },
        altitude: {
          m: 1,
          ft: 3.28084,
          FL: 0.00328084
        },
        distance: {
          m: 1,
          Km: 0.001,
          NM: 0.000539957,
          Mile: 0.000621371,
          Yard: 1.09361
        },
        consumptions: ["/h", "/1000ft", "each"],
        references: ["ASFC", "QNH", "AMSL", "-"]
      }
    };
  },
  filters: {
    with(value, unit) {
      if (typeof unit == "string")
        switch (unit) {
          case "FL":
            return `FL${value.toString().padStart(3, "0")}`;
          default:
            return `${value.toString()}${unit}`;
        }
    },

    to(value, unit) {
      const fact = {
        "m/s": 1,
        "km/h": 3.6,
        "ft/min": 196.85,
        kt: 1.94384,
        // "Mach": 343, // changes with T° and Pressure
        mph: 2.23694,
        L: 1,
        "gal US": 0.264172,
        "gal Imp": 0.219969,
        m: 1,
        ft: 3.28084,
        FL: 0.00328084,
        Km: 0.001,
        NM: 0.000539957,
        Mile: 0.000621371,
        Yard: 1.09361
      };

      if (!value) return "-";
      else if (isNaN(value)) return value.value * fact[value.unit];
      else return value * fact[unit];
    },

    asHeading(value) {
      return (value + 360) % 360;
    },
    asDirection(value) {
      return ((value + 540) % 360) - 180;
    },
    fromTimestamp(value) {
      return new Date(Math.round(value / 1000));
    },
    asDuration(value) {
      // TODO: Check if working with very long duration (days, week)
      if (value) {
        return new Date(value * 1000).toLocaleTimeString(undefined, {
          timeZone: "UTC",
          hour12: false,
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit"
        });
      } else return "-";
    },
    precision(value, precision = 2) {
      // TODO: could handle time if power base is adapted
      const fact = 10 ** precision;
      if (isNaN(value)) return value;
      return Math.round(value * fact + Number.EPSILON) / fact;
    }
  }
};
