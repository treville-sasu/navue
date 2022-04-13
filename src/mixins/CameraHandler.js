export default {
  data() {
    return {
      settings: {
        followMode: "north",
        preventCamera: 10000,
      },
    };
  },
  methods: {
    showPoint(point) {
      //FIXME: inhibitCamera for location display ?!
      point &&
        this.setCamera({ features: [point] }, { followMode: "location" });
    },
    inhibitCamera({ followMode }) {
      if (!followMode) {
        clearTimeout(this.timerCamera);
        this.timerCamera = setTimeout(() => {
          this.timerCamera = undefined;
        }, this.settings.preventCamera);
      }
    },
    setCamera({ features, ...camera }, event) {
      if (features && features.length)
        camera = this.buildCamera(features, event.followMode);
      if (!this.timerCamera && event.followMode) {
        if (camera instanceof this.$mapx.FreeCameraOptions)
          this.map.setFreeCameraOptions(camera, event);
        else if (camera) this.map.easeTo(camera, event);
      }
    },
    buildCamera(features, mode) {
      let len = features.length;
      if (len < 2)
        return {
          ...this.map.cameraForBounds(features[0].bbox, {
            bearing: 0,
            pitch: 0,
            padding: 20,
          }),
        };

      switch (mode) {
        case "heading":
          return this.map.cameraForBounds(
            [features[0].lngLat, features[len - 2].lngLat],
            {
              bearing: features[0].properties.heading,
              pitch: 0,
              padding: { top: 50, bottom: 50 },
            }
          );
        case "north": {
          const center = this.$mapx.LngLat.convert(features[0].lngLat);
          const futur = this.$mapx.LngLat.convert(features[len - 2].lngLat);
          return this.map.cameraForBounds(
            center.toBounds(center.distanceTo(futur)),
            { bearing: 0, padding: 20 }
          );
        }
        case "fpv": {
          const camera = new this.$mapx.FreeCameraOptions(
            this.$mapx.MercatorCoordinate.fromLngLat(
              features[0].lngLat,
              features[0].altitude
            )
          );
          camera.lookAtPoint(features[1].lngLat);
          return camera;
        }
      }
    },
  },
};
