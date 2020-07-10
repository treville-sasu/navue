<template>
  <l-layer-group>
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

<style scoped>
@import "~leaflet-minimap/dist/Control.MiniMap.min.css";
</style>

<script>
import { LLayerGroup, LTileLayer } from "vue2-leaflet";

export default {
  name: "BaseMapsLayers",
  components: {
    LLayerGroup,
    LTileLayer
  },
  data() {
    return {
      tileLayers: [
        {
          name: "Sattelite IGN",
          attribution:
            "<a target='_blank' href='https://www.geoportail.gouv.fr/'>Geoportail France</a>",
          url:
            "https://wxs.ign.fr/{apikey}/geoportail/wmts?REQUEST=GetTile&SERVICE=WMTS&VERSION=1.0.0&STYLE={style}&TILEMATRIXSET=PM&FORMAT={format}&LAYER={variant}&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}",
          options: {
            variant: "ORTHOIMAGERY.ORTHOPHOTOS",
            apikey: "7d4hl8l320bxpi56m3hosljf",
            maxZoom: 17,
            minZoom: 13,
            format: "image/jpeg",
            style: "normal"
          }
        },
        {
          name: "Fond Géographique",
          attribution:
            "<a target='_blank' href='https://www.arcgis.com/'>ArcGIS</a>",
          url:
            "https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}",
          // "https://{s}.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}",
          subdomains: ["server", "services"],
          options: {
            maxZoom: 13
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
            apikey: "7d4hl8l320bxpi56m3hosljf",
            maxZoom: 11,
            minZoom: 8,
            format: "image/jpeg",
            style: "normal"
          }
        }
      ]
    };
  }
};
</script>
