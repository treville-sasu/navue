import L from "leaflet";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png")
});

// L.Map.include({
//   _initControlPos: function() {
//     var corners = (this._controlCorners = {}),
//       l = "leaflet-",
//       container = (this._controlContainer = L.DomUtil.create(
//         "div",
//         l + "control-container",
//         this._container
//       ));

//     function createCorner(vSide, hSide) {
//       var className = l + vSide + " " + l + hSide;

//       corners[vSide + hSide] = L.DomUtil.create("div", className, container);
//     }

//     createCorner("top", "left");
//     createCorner("top", "right");
//     createCorner("bottom", "left");
//     createCorner("bottom", "right");

//     createCorner("top", "center");
//     createCorner("middle", "center");
//     createCorner("middle", "left");
//     createCorner("middle", "right");
//     createCorner("bottom", "center");
//   }
// });
