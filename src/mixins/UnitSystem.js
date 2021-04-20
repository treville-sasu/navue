export default {
  filters: {
    as(value, unit, precision) {
      if (value) return value.as(unit, precision);
    },
    asDuration(value) {
      // TODO: Check if working with very long duration (days, week)
      if (value) {
        return new Date(value).toLocaleTimeString(undefined, {
          timeZone: "UTC",
          hour12: false,
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit"
        });
      } else return "-";
    }
  }
};
