import { Waypoint } from "@/models/Waypoint.js";

export const DestinationHandler = {
  data() {
    return {
      currentDestination: undefined,
      settings: {
        minDestination: 100,
        futurPositionDelay: 3
      }
    };
  },
  methods: {
    setDestination({ latlng } = {}) {
      if (arguments[0] instanceof Waypoint)
        this.currentDestination = arguments[0];
      else
        this.currentDestination = Waypoint.fromEvent({
          lngLat: latlng
        });
    },
    getDestination(lastDestination) {
      //TODO : on route select, set a Next Destination
      if (
        this.destination &&
        lastDestination.distanceTo(this.destination) <
          this.settings.minDestination
      ) {
        this.currentDestination = this.navigation.getNextWaypoint(
          this.currentDestination
        );
      } else return;
    }
  }
};
