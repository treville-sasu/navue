import { Waypoint } from "@/models/Waypoint.js";

export const DestinationHandler = {
  data() {
    return {
      destination: undefined,
      settings: {
        minDestination: 100,
        futurPositionDelay: 3
      }
    };
  },
  methods: {
    setDestination({ latlng, latitude, longitude, altitude } = {}) {
      this.destination = Waypoint.from({
        latlng,
        latitude,
        longitude,
        altitude,
        type: "Waypoint"
      });
    },
    getDestination(lastDestination) {
      //TODO : on route select, set a Next Destination
      if (
        this.destination &&
        lastDestination.distanceTo(this.destination) <
          this.settings.minDestination
      ) {
        this.destination = this.navigation.getNextWaypoint(this.destination);
      } else return;
    }
  }
};
