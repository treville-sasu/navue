export default {
  data() {
    return {
      settings: {
        viewMode: "north",
        preventCamera: 10000
      }
    };
  },
  methods: {
    inhibitCamera({ trigger }) {
      if (!trigger) {
        clearTimeout(this.timerCamera);
        this.timerCamera = setTimeout(() => {
          this.timerCamera = undefined;
        }, this.settings.preventCamera);
      }
    },
    setCamera(camera, event) {
      if (!this.timerCamera)
        if (camera instanceof this.$mapx.FreeCameraOptions)
          this.map.setFreeCameraOptions(camera, event);
        else if (camera) this.map.flyTo(camera, event);
    },
    buildCamera(course) {
      if (course.features.length < 2)
        return {
          ...this.map.cameraForBounds(course.features[0].bbox, {
            bearing: 0,
            pitch: 0,
            padding: 20
          })
        };

      const center = this.$mapx.LngLat.convert(course.features[0].lngLat),
        futur = this.$mapx.LngLat.convert(
          course.features[course.features.length - 2].lngLat
        );

      switch (this.settings.viewMode) {
        case "heading":
          return this.map.cameraForBounds(
            new this.$mapx.LngLatBounds(center, futur),
            {
              bearing:
                course.features[0].properties.heading &&
                course.features[0].properties.heading.value,
              pitch: 0,
              padding: 20
            }
          );
        case "north":
          return this.map.cameraForBounds(
            center.toBounds(center.distanceTo(futur)),
            { bearing: 0, padding: 20 }
          );
        case "fpv":
          // eslint-disable-next-line no-case-declarations
          const camera = new this.$mapx.FreeCameraOptions(
            this.$mapx.MercatorCoordinate.fromLngLat(
              center,
              course.features[0].altitude
            )
          );
          camera.lookAtPoint(futur);
          return camera;
      }
    }
  }
};
