<template>
  <b-table :data="featureDetection" :striped="true">
    <b-table-column field="api" label="Which Tech" v-slot="props">
      {{ props.row.api }}
    </b-table-column>
    <b-table-column field="feature" label="Feature" v-slot="props">
      {{ props.row.feature }}
    </b-table-column>
    <b-table-column
      label="Support"
      v-slot="props"
      field="test"
      :centered="true"
    >
      <span>
        <b-icon
          :icon="props.row.test ? 'check-decagram' : 'alert-decagram-outline'"
          :type="
            props.row.test
              ? 'is-success'
              : props.row.required
              ? 'is-danger'
              : 'is-warning'
          "
        >
        </b-icon>
      </span>
    </b-table-column>
  </b-table>
</template>

<script>
export default {
  name: "BrowserCheck",
  data() {
    return {
      search: ""
    };
  },
  computed: {
    featureDetection() {
      return [
        {
          api: "Service Worker",
          feature: "Internet request handling",
          test: "serviceWorker" in navigator,
          required: true
        },
        {
          api: "Cache",
          feature: "Allow caching for app, charts and weather maps.",
          test: "caches" in self,
          required: true
        },
        {
          api: "Geolocation",
          feature: "Get your location with a GNSS",
          test: "geolocation" in navigator
        },
        {
          api: "Fullscreen",
          feature: "Set a map fullscreen",
          test: "requestFullscreen" in document.documentElement
        },
        {
          api: "WakeLock",
          feature: "Keep your screen on while flying",
          test:
            "wakeLock" in navigator && document.visibilityState === "visible"
        },
        {
          api: "App Installation",
          feature: "Add the app to your Home screen",
          test:
            "BeforeInstallPromptEvent" in window || "setAppBadge" in navigator
        },
        {
          api: "Online State",
          feature: "Better online/offline switch",
          test: "connection" in navigator
        },
        {
          api: "IndexedDB",
          feature: "Local database for data synchronisation",
          test: "indexedDB" in window,
          required: true
        },
        {
          api: "Storage",
          feature: "In browser storage management",
          test: "storage" in navigator && "estimate" in navigator.storage
        },
        {
          api: "Device Motion",
          feature: "Get rotation & acceleration measurement",
          test:
            ("LinearAccelerationSensor" in window && "Gyroscope" in window) ||
            "DeviceMotionEvent" in window
        }
      ];
    }
  }
};
</script>
