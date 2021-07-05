<template>
  <l-layer-group v-bind="$attrs" v-on="$listeners">
    <l-tile-layer
      v-for="layer in tileLayers"
      :key="layer.name"
      :url="layer.url"
      :name="layer.name"
      :attribution="layer.attribution"
      :options="layer.options"
    />
  </l-layer-group>
</template>

<script>
import { LLayerGroup, LTileLayer } from "vue2-leaflet";

export default {
  name: "LBaseLayerGroup",
  components: {
    LLayerGroup,
    LTileLayer
  },
  data() {
    return {
      tileLayers: [
        {
          name: "Fond de carte naVue",
          attribution:
            "© <a href='https://apps.mapbox.com/feedback/'>Mapbox</a>",
          url:
            "https://api.mapbox.com/styles/v1/{username}/{style_id}/tiles/{z}/{x}/{y}?access_token={token}",
          options: {
            username: process.env.VUE_APP_MAPBOX_USERNAME,
            style_id: "ckoleyexd2sem18pf9gmhzmgu",
            token: process.env.VUE_APP_MAPBOX_TOKEN,
            tileSize: 512,
            zoomOffset: -1,

            format: "image/jpeg",
            style: "normal",
            crossOrigin: true
          }
        },
        {
          name: "Carte IGN OACI",
          attribution:
            "<a target='_blank' href='https://www.geoportail.gouv.fr/'>Geoportail France</a>",
          url:
            "https://wxs.ign.fr/{apikey}/geoportail/wmts?REQUEST=GetTile&SERVICE=WMTS&VERSION=1.0.0&STYLE={style}&TILEMATRIXSET=PM&FORMAT={format}&LAYER={variant}&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}",
          options: {
            variant: "GEOGRAPHICALGRIDSYSTEMS.MAPS.SCAN-OACI",
            apikey: process.env.VUE_APP_GEOPORTAIL_KEY,
            maxZoom: 11,
            minZoom: 8,
            bounds: [
              [41.32, -5.15],
              [51.1, 9.57]
            ],
            format: "image/jpeg",
            style: "normal",
            crossOrigin: true
          }
        },
        {
          name: "Carte Swisstopo OACI",
          attribution:
            "© <a href='https://www.swisstopo.ch/' target='_blank'>Swisstopo</a>",
          url:
            "https://wmts20.geo.admin.ch/1.0.0/{layer}/default/current/3857/{z}/{x}/{y}.{format}",
          options: {
            layer: "ch.bazl.luftfahrtkarten-icao",
            maxZoom: 11,
            minZoom: 9,
            bounds: [
              [45.7769477403, 6.02260949059],
              [47.8308275417, 10.4427014502]
            ],
            format: "png",
            crossOrigin: true
          }
        }
      ]
    };
  }
};
</script>
