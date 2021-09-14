export default class {
  constructor(urls) {
    this.sources = {
      AZBA: "https://www.sia.aviation-civile.gouv.fr/schedules",
      VAC: "https://www.sia.aviation-civile.gouv.fr/",
      NOTAM: {
        // https request is required to prevent Mixed-Content restriction. but real server protocol is http.this tweak is required when request are proxied via ServiceWorker.
        AERO:
          "https://notamweb.aviation-civile.gouv.fr/Script/IHM/Bul_Aerodrome.php",
        R_ETROITE:
          "https://notamweb.aviation-civile.gouv.fr/Script/IHM/Bul_R-ETR.php"
      },
      ...urls
    };
  }

  // get ready() {
  //   return !!this.sources.cycle;
  // }

  async fetch(target, options = {}) {
    const response = await fetch(target, options);
    if (!response.ok)
      throw { code: response.status, message: response.statusText };
    else {
      const text = await response.text();
      return new DOMParser().parseFromString(text, "text/html");
    }
  }

  ///////////////////////////// VAC

  // https://www.sia.aviation-civile.gouv.fr/documents/htmlshow?f=dvd/eAIP_05_NOV_2020/Atlas-VAC/home.htm
  async getCycle() {
    const document = await this.fetch(this.sources.VAC);
    const href = document.querySelector("a[href*=Atlas-VAC]").href;
    const path = new URL(href).searchParams.get("f");
    return (this.sources.cycle = new URL(
      path.replace("home.htm", "PDF_AIPparSSection/VAC/AD/"),
      this.sources.VAC
    ));
  }
  // https://www.sia.aviation-civile.gouv.fr/dvd/eAIP_18_JUN_2020/Atlas-VAC/PDF_AIPparSSection/VAC/AD/AD-2.LFDA.pdf
  // https://www.sia.aviation-civile.gouv.fr/dvd/eAIP_05_NOV_2020/Atlas-VAC/PDF_AIPparSSection/VAC/AD/AD-2.LFMA.pdf
  getVAC(code) {
    return new URL(`AD-2.${code}.pdf`, this.sources.cycle);
  }

  /////////////////////////// AZBA
  async getAZBA() {
    const document = await this.fetch(this.sources.AZBA);
    const elements = Array.from(document.getElementsByTagName("iframe"));

    return elements.map(i => {
      const [url, year, month, day, st_h, st_min, ed_h, ed_min] = i.src.match(
        /.*(\d{4})-(\d{2})-(\d{2})_(\d{2})(\d{2})-(\d{2})(\d{2}).pdf+/i
      );
      const start = new Date(Date.UTC(year, month - 1, day, st_h, st_min));
      const end = new Date(Date.UTC(year, month - 1, day, ed_h, ed_min));

      return { url, start, end };
    });
  }
  /////////////////////////// NOTAM
  async getNOTAM({ type, ...query }) {
    const document = await this.fetch(this.sources.NOTAM[type], {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: new URLSearchParams(this.notamParams({ type, query }))
    });

    const collection = Array.from(document.querySelectorAll("pre")).map(pre =>
      this.decodeMessage(pre.innerText)
    );
    return this.groupBy(collection, "A", m => m);
  }

  notamParams({ type, query }) {
    let params = {
      bResultat: true,
      bImpression: "",
      // COMPLET | RESUME
      ModeAffichage: "COMPLET",
      [`${type}_Langue`]: "FR",
      //"2020/11/30"
      [`${type}_Date_DATE`]: query.datetime.toLocaleString("ja-jp", {
        timeZone: "UTC",
        hour12: false,
        year: "numeric",
        month: "2-digit",
        day: "2-digit"
      }),
      //"09:45"
      [`${type}_Date_HEURE`]: query.datetime.toLocaleString("en-us", {
        timeZone: "UTC",
        hour12: false,
        hour: "2-digit",
        minute: "2-digit"
      }),
      [`${type}_Duree`]: query.durations || 12,
      // IFR/VFR:1, IFR:2, VFR:3
      [`${type}_CM_REGLE`]:
        ["IFR/VFR", "IFR", "VFR"].indexOf(query.flightrules) + 1,
      // OUI:1, NON:2
      [`${type}_CM_GPS`]: query.complementary.includes("gps") ? 1 : 2,
      // OUI:1, NON:2
      [`${type}_CM_INFO_COMP`]: query.complementary.includes("misc") ? 1 : 2
    };

    switch (type) {
      case "AERO":
        params[`${type}_Rayon`] = query.width || 10;
        params[`${type}_Plafond`] = Math.max(...query.levels) || 30;
        break;
      case "R_ETROITE":
        params[`${type}_Couloir`] = query.width || 10;
        params[`${type}_NivMin`] = Math.min(...query.levels) || 0;
        params[`${type}_NivMax`] = Math.max(...query.levels) || 999;
        // OUI:1, NON:2
        params[`${type}_CM_ROUTE`] = query.complementary.includes("flyover")
          ? 1
          : 2;
        break;
      // case "FIR":
    }

    const PREFIX = {
      AERO: "AERO_Tab_Aero",
      R_ETROITE: "R_ETROITE_Tab_POINT"
    };

    return {
      ...params,
      ...this.locationsFromCodes(query.codes, PREFIX[type])
    };
  }

  locationsFromCodes(codes, prefix) {
    let entries = new Array(12).fill("");
    entries.splice(0, codes.length, ...codes);

    const params = entries.map((code, index) => [
      `${prefix}[${index}]`,
      code.id || ""
    ]);
    return Object.fromEntries(params);
  }

  decodeMessage(message) {
    return {
      id: message.split("\n")[0].trim(),
      raw: message,
      ...Object.fromEntries(
        Array.from(
          message.matchAll(/([QABCDEFG])\) (.+?)(?=(?: |\n)+[QABCDEFG]\) |$)/gs)
        ).map(m => [m[1], m[2].trim()])
      )
    };
  }

  groupBy(col, attr, cb) {
    return col.reduce((rv, x) => {
      if (x) (rv[x[attr]] = rv[x[attr]] || []).push(cb.call(null, x));
      return rv;
    }, {});
  }
}

// http://notamweb.aviation-civile.gouv.fr/Script/IHM/Bul_Aerodrome.php
// bResultat=true
// bImpression=
// ModeAffichage=COMPLET
// AERO_Langue=FR
// AERO_Date_DATE=2021/08/31
// AERO_Date_HEURE=14:03
// AERO_Duree=12
// AERO_Rayon=10
// AERO_Plafond=30
// AERO_CM_REGLE=3
// AERO_CM_GPS=1
// AERO_CM_INFO_COMP=1
// AERO_Tab_Aer[0]=
// AERO_Tab_Aer[1]=
// AERO_Tab_Aer[2]=
// AERO_Tab_Aer[3]=
// AERO_Tab_Aer[4]=
// AERO_Tab_Aer[5]=
// AERO_Tab_Aer[6]=
// AERO_Tab_Aer[7]=
// AERO_Tab_Aer[8]=
// AERO_Tab_Aer[9]=
// AERO_Tab_Aer[10]=
// AERO_Tab_Aer[11]=

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
