<script>
import { DomEvent } from "leaflet";
import { propsBinder } from "vue2-leaflet";
import Geocoder from "leaflet-control-geocoder";
import "leaflet-control-geocoder/dist/Control.Geocoder.css";

export default {
  name: "LControlGeocoder",
  props: {
    // collapsed: Boolean,
    // expand: String,
    // position: String,
    // placeholder: String,
    // errorMessage: String,
    // iconLabel: String,
    // geocoder: IGeocoder,
    // showUniqueResult: Boolean,
    // showResultIcons: Boolean,
    // suggestMinLength: Number,
    // suggestTimeout: Number,
    // query: String,
    // queryMinLength: Number,
    options: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  mounted() {
    this.mapObject = new Geocoder(this.options);

    propsBinder(this, this.mapObject, this.$options.props);
    DomEvent.on(this.mapObject, this.$listeners);

    this.mapObject.on(
      "markgeocode",
      function(e) {
        this.fitBounds(e.geocode.bbox);
      },
      this.$parent.mapObject
    );

    this.mapObject.addTo(this.$parent.mapObject);

    this.$nextTick(() => {
      /**
       * Triggers when the component is ready
       * @type {object}
       * @property {object} mapObject - reference to leaflet map object
       */
      this.$emit("ready", this.mapObject);
    });
  },
  beforeDestroy() {
    this.mapObject.remove();
  },
  render() {
    return null;
  },
  methods: {
    markGeocode(geocode) {
      this.mapObject.markGeocode(geocode);
    },
    setQuery(query) {
      this.mapObject.setQuery(query);
    }
  }
};
</script>
