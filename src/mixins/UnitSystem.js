export default {
  filters: {
    as(value, unit, precision) {
      if (value) return value.as(unit, precision);
    },
    asDuration(value, factor = 1) {
      // TODO: Check if working with very long duration (days, week)
      return new Date(value * factor || 0).toLocaleTimeString(undefined, {
        timeZone: "UTC",
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
      });
    }
  }
};
