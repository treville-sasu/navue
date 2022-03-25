import c from "@/assets/colors.scss";

export default {
  data() {
    return {
      mapSettings: {
        base: {
          mapStyle:
            "mapbox://styles/mabrenac/ckoleyexd2sem18pf9gmhzmgu?optimize=true",
          zoom: 10,
          center: { lat: 42.69597591582309, lng: 2.879308462142945 } // le centre du Monde selon S. Dali
        },
        sia: {
          id: "sia-ign",
          type: "raster",
          source: {
            type: "raster",
            attribution:
              "<a target='_blank' href='https://www.geoportail.gouv.fr/'>Geoportail</a>",
            tiles: [
              `https://wxs.ign.fr/${process.env.VUE_APP_GEOPORTAIL_KEY}/geoportail/wmts?REQUEST=GetTile&SERVICE=WMTS&VERSION=1.0.0&STYLE=normal&TILEMATRIXSET=PM&FORMAT=image/jpeg&LAYER=GEOGRAPHICALGRIDSYSTEMS.MAPS.SCAN-OACI&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}`
            ],
            tileSize: 256,
            bounds: [-5.99644, 40.3893, 11.146, 51.4441]
          },
          maxzoom: 11,
          minzoom: 9
        },
        swisstopo: {
          id: "swisstopo",
          type: "raster",
          source: {
            type: "raster",
            attribution:
              "© <a href='https://www.swisstopo.ch/' target='_blank'>Swisstopo</a>",
            tiles: [
              "https://wmts20.geo.admin.ch/1.0.0/ch.bazl.luftfahrtkarten-icao/default/current/3857/{z}/{x}/{y}.png"
            ],
            bounds: [6.022609, 45.776947, 10.4427014, 47.830827]
          },
          maxzoom: 11,
          minzoom: 9
        },
        flight: {
          path: {
            type: "line",
            filter: ["==", ["geometry-type"], "LineString"],
            layout: {
              "line-join": "round",
              "line-cap": "round"
            },
            paint: {
              "line-color": [
                "case",
                ["boolean", ["feature-state", "selected"], false],
                c["info"],
                c["primary"]
              ],
              "line-width": [
                "case",
                ["boolean", ["feature-state", "selected"], false],
                6,
                8
              ]
            }
          }
        }
      }
    };
  }
};
