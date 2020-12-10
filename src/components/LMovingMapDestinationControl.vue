<template>
  <l-control v-bind="$attrs">
    <b-field grouped group-multiline>
      <div class="control">
        <b-taglist attached>
          <b-tag type="is-success" size="is-medium">{{
            distance | to("NM") | precision(0)
          }}</b-tag>
          <b-tag type="is-light" size="is-medium">NM</b-tag>
        </b-taglist>
      </div>
      <div class="control">
        <b-taglist attached>
          <b-tag type="is-info" size="is-medium">{{
            heading | asHeading | precision(0)
          }}</b-tag>
          <b-tag type="is-light" size="is-medium">°</b-tag>
        </b-taglist>
      </div>
      <!-- <div class="control">
        <b-taglist attached>
          <b-tag type="is-warning" size="is-medium">{{
            to.altitude | is('ft') | precision(-1)
          }}</b-tag>
          <b-tag type="is-light" size="is-medium">ft</b-tag>
          <b-tag type="is-danger" size="is-medium">{{
            vertical_speed | is("ft/min") | precision(-1)
          }}</b-tag>
          <b-tag type="is-light" size="is-medium">ft/min</b-tag>
        </b-taglist>
      </div> -->
      <div class="control">
        <b-taglist attached>
          <b-tag type="is-light" size="is-medium">ETE</b-tag>
          <b-tag type="is-primary" size="is-medium">{{
            ETE | asDuration
          }}</b-tag>
        </b-taglist>
      </div>
    </b-field>
  </l-control>
</template>

<script>
import UnitSystem from "@/mixins/UnitSystem.js";
import { LControl } from "vue2-leaflet";
import LatLon from "geodesy/latlon-ellipsoidal-vincenty.js";

export default {
  name: "LMovingMapDestinationControl",
  components: {
    LControl
  },
  props: {
    from: Object,
    to: Object
  },
  mixins: [UnitSystem],
  computed: {
    distance() {
      return this.from.latlng.distanceTo(this.to.latlng);
    },
    ETE() {
      return this.distance / this.from.speed;
    },
    heading() {
      return this.latlon(this.from).initialBearingTo(this.latlon(this.to));
    },
    relative_bearing() {
      return this.heading - this.from.heading;
    },
    vertical_speed() {
      return (this.to.altitude - this.from.altitude) / this.ETE;
    }
  },
  methods: {
    latlon(point) {
      return new LatLon(point.latlng.lat, point.latlng.lng);
    }
  }
};
</script>
