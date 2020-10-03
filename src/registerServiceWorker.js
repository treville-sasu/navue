/* eslint-disable no-console */

import { Workbox } from "workbox-window";
import { SnackbarProgrammatic as Snackbar } from "buefy";

if ("serviceWorker" in navigator && process.env.NODE_ENV === "production") {
  const wb = new Workbox(`${process.env.BASE_URL}service-worker.js`);

  wb.addEventListener("installed", event => {
    if (!event.isUpdate) {
      Snackbar.open({
        type: "is-warning",
        message: "naVue is now installed on your device.",
        actionText: null,
        indefinite: false,
        duration: 1000
      });
    } else {
      Snackbar.open({
        type: "is-warning",
        message: "Loading new version of naVue.",
        actionText: null,
        indefinite: false,
        duration: 1000
      });
    }
  });
  wb.addEventListener("waiting", () => {
    Snackbar.open({
      type: "is-warning",
      indefinite: true,
      message: "A new version of naVue is available.",
      actionText: "Use it now",
      onAction: () => {
        wb.messageSW({ type: "SKIP_WAITING" });
      }
    });
  });
  // wb.addEventListener('controlling', event => {
  //   console.log(event, "controlling");
  //   // proxy will work know
  // });

  wb.addEventListener("activated", () => {
    Snackbar.open({
      type: "is-warning",
      message: "Welcome to the new version of naVue.",
      actionText: null,
      indefinite: false,
      duration: 1000
    });
  });

  wb.register();
}
