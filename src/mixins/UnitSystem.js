export default {
  filters: {
    as(value, unit, precision) {
      if (value) return value.as(unit, precision);
    },
    asDuration(value, factor = 1) {
      return value
        ? (value instanceof Date
            ? value
            : new Date(value * factor)
          ).toLocaleTimeString(undefined, {
            timeZone: "UTC",
            hour12: false,
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit"
          })
        : "-";
    }
  }
};
