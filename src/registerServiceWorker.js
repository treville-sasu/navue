/* eslint-disable no-console */

import { Workbox } from "workbox-window";
import { SnackbarProgrammatic as Snackbar } from "buefy";

const wb = new Workbox(`${process.env.BASE_URL}service-worker.js`);
export default wb;

if ("serviceWorker" in navigator) {
  // if ("serviceWorker" in navigator && process.env.NODE_ENV === "production") {
  const snack = {
    type: "is-warning",
    actionText: null,
    indefinite: false,
    duration: 1000
  };

  wb.addEventListener("installed", event => {
    if (!event.isUpdate) {
      Snackbar.open({
        ...snack,
        message: "naVue is now installed on your device."
      });
    } else {
      Snackbar.open({
        ...snack,
        message: "Loading new version of naVue."
      });
    }
  });

  wb.addEventListener("waiting", () => {
    Snackbar.open({
      ...snack,
      indefinite: true,
      message: "A new version of naVue is available.",
      actionText: "Use it now",
      onAction: () => {
        wb.messageSW({ type: "SKIP_WAITING" });
      }
    });
  });

  wb.addEventListener("controlling", () => {
    window.location.reload();
  });

  wb.addEventListener("activated", () => {
    Snackbar.open({
      ...snack,
      message: "Welcome to the new version of naVue."
    });
  });

  wb.register();
}
