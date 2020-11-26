import CorsProxy from "@/mixins/CorsProxy";

export default {
  mixins: [CorsProxy],
  data() {
    return {
      AZBASourceUrl: "https://www.sia.aviation-civile.gouv.fr/schedules",
      VACSourceUrl: "https://www.sia.aviation-civile.gouv.fr/",
      NOTAMSourceUrl:
        "http://notamweb.aviation-civile.gouv.fr/Script/IHM/Bul_Aerodrome.php"
    };
  },
  methods: {
    async fetchSIA(target, options = {}) {
      const response = await fetch(this.proxyUrl(target), options);
      if (!response.ok)
        throw { code: response.status, message: response.statusText };
      else {
        const text = await response.text();
        return new DOMParser().parseFromString(text, "text/html");
      }
    },
    async getAZBAfiles(target) {
      const document = await this.fetchSIA(target);
      const elements = Array.from(document.getElementsByTagName("iframe"));

      return elements.map(i => {
        let [url, date, st_h, st_min, ed_h, ed_min] = i.src.match(
          /.*(\d{4}-\d{2}-\d{2})_(\d{2})(\d{2})-(\d{2})(\d{2}).pdf+/i
        );
        const start = new Date(Date.parse(`${date}T${st_h}:${st_min}`));
        const end = new Date(Date.parse(`${date}T${ed_h}:${ed_min}`));
        date = new Date(Date.parse(date));
        return { url, date, start, end };
      });
    },
    async getVACbaseUrl(target) {
      // https://www.sia.aviation-civile.gouv.fr/documents/htmlshow?f=dvd/eAIP_05_NOV_2020/Atlas-VAC/home.htm
      const document = await this.fetchSIA(target);
      const href = document.querySelector("a[href*=Atlas-VAC]").href;
      const path = new URL(href).searchParams.get("f");
      return new URL(
        path.replace("home.htm", "PDF_AIPparSSection/VAC/AD/"),
        target
      );
    },
    VACurl(code, baseURL = this.baseURL) {
      // https://www.sia.aviation-civile.gouv.fr/dvd/eAIP_18_JUN_2020/Atlas-VAC/PDF_AIPparSSection/VAC/AD/AD-2.LFDA.pdf
      // https://www.sia.aviation-civile.gouv.fr/dvd/eAIP_05_NOV_2020/Atlas-VAC/PDF_AIPparSSection/VAC/AD/AD-2.LFMA.pdf
      return new URL(`AD-2.${code}.pdf`, baseURL);
    },

    async getAirportNOTAMs(params, target) {
      const document = await this.fetchSIA(target, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: new URLSearchParams(this.formatAeroParams(params)).toString()
      });
      return Array.from(document.querySelectorAll("pre")).map(
        pre => pre.innerText
      );
    },

    formatAeroParams(params) {
      return {
        bResultat: true,
        bImpression: "",
        ModeAffichage: "COMPLET", // "RESUME"
        AERO_Langue: "FR",
        AERO_Date_DATE: params.datetime.toLocaleString("ja-jp", {
          timeZone: "UTC",
          hour12: false,
          year: "numeric",
          month: "2-digit",
          day: "2-digit"
        }), //"2020/11/30"
        AERO_Date_HEURE: params.datetime.toLocaleString("en-us", {
          timeZone: "UTC",
          hour12: false,
          hour: "2-digit",
          minute: "2-digit"
        }), //"09:45"
        AERO_Duree: params.durations || 12,
        AERO_Rayon: params.radius || 10,
        AERO_Plafond: params.ceiling || 30,
        AERO_CM_REGLE:
          ["IFR/VFR", "IFR", "VFR"].indexOf(params.flightrules) + 1, // IFR/VFR:1, IFR:2, VFR:3
        AERO_CM_GPS: params.complementary.includes("gps") ? 1 : 2, // OUI:1, NON:2
        AERO_CM_INFO_COMP: params.complementary.includes("misc") ? 1 : 2, // OUI:1, NON:2
        ...this.buildCodesParam(params.codes, "AERO_Tab_Aero")
      };
    },
    buildCodesParam(codes, root) {
      let entries = new Array(12).fill("");
      entries.splice(0, codes.length, ...codes);

      const params = entries.map((code, index) => [
        `${root}[${index}]`,
        code.id || ""
      ]);
      return Object.fromEntries(params);
    }
  }
};

// http://notamweb.aviation-civile.gouv.fr/Script/IHM/Bul_R-ETR.php
// {
//   "bResultat": "true",
//   "bImpression": "",
//   "ModeAffichage": "COMPLET",
//   "R_ETROITE_Date_DATE": "2020/11/24",
//   "R_ETROITE_Date_HEURE": "13:44",
//   "R_ETROITE_Langue": "FR",
//   "R_ETROITE_Duree": "12",
//   "R_ETROITE_CM_REGLE": "1",
//   "R_ETROITE_CM_GPS": "2",
//   "R_ETROITE_CM_INFO_COMP": "1",
//   "R_ETROITE_CM_ROUTE": "2", //aerodromes survolés
//   "R_ETROITE_NivMin": "0",
//   "R_ETROITE_NivMax": "999",
//   "R_ETROITE_AeroDepart": "LFDT",
//   "R_ETROITE_AeroArrivee": "LFDT",
//   "R_ETROITE_Tab_Aero[0]": "LFDT", // Dégagements
//   "R_ETROITE_Tab_Aero[1]": "LFDT", // Dégagements
//   "R_ETROITE_Tab_Aero[2]": "LFDT", // Dégagements
//   "R_ETROITE_Tab_Aero[3]": "LFDT", // Dégagements
//   "R_ETROITE_Couloir": "30",
//   "R_ETROITE_Tab_POINT[0]": "LFDT",
//   "R_ETROITE_Tab_POINT[1]": "LFDT",
//   "R_ETROITE_Tab_POINT[2]": "LFDT",
//   "R_ETROITE_Tab_POINT[3]": "LFDT",
//   "R_ETROITE_Tab_POINT[4]": "LFDT",
//   "R_ETROITE_Tab_POINT[5]": "",
//   "R_ETROITE_Tab_POINT[6]": "",
//   "R_ETROITE_Tab_POINT[7]": "",
//   "R_ETROITE_Tab_POINT[8]": "",
//   "R_ETROITE_Tab_POINT[9]": "",
//   "R_ETROITE_Tab_POINT[10]": "",
//   "R_ETROITE_Tab_POINT[11]": ""
// }

// http://notamweb.aviation-civile.gouv.fr/Script/IHM/Bul_FIR.php
// {
//   bResultat: "true",
//   bImpression: "",
//   ModeAffichage: "COMPLET",
//   FIR_Date_DATE: "2020/11/24",
//   FIR_Date_HEURE: "13:48",
//   FIR_Langue: "FR",
//   FIR_Duree: "12",
//   FIR_CM_REGLE: "1",
//   FIR_CM_GPS: "2",
//   FIR_CM_INFO_COMP: "1",
//   FIR_CM_ROUTE: "2", //aerodromes survolés
//   FIR_NivMin: "0",
//   FIR_NivMax: "999",
//   "FIR_Tab_Fir[0]": "LFBB",
//   "FIR_Tab_Fir[1]": "",
//   "FIR_Tab_Fir[2]": "",
//   "FIR_Tab_Fir[3]": "",
//   "FIR_Tab_Fir[4]": "",
//   "FIR_Tab_Fir[5]": "",
//   "FIR_Tab_Fir[6]": "",
//   "FIR_Tab_Fir[7]": "",
//   "FIR_Tab_Fir[8]": "",
//   "FIR_Tab_Fir[9]": ""
// }
