import axios from "axios";
import xmljs from "xml-js";

// Build with :
// Référence: DP / GT / DocServeurAeroweb
// Version du document: 9 Statut: Définitif
// Date: 07 / 11 / 2019
// Rédacteur: Sylvie Guidotti
// Mise à jour: Nadège Martin

export default class AeroWeb {
  constructor(key, options) {
    this.options = {
      baseURL: this.constructor.baseURL,
      url: this.constructor.pathname,
      method: "get",
      responseType: "text",
      params: { ID: key }, // CODE_METEO to be sent par request.
      transformResponse: [
        data => {
          return xmljs.xml2js(data, { compact: true, ignoreDeclaration: true });
        },
        AeroWeb.sanitizeAttributes
      ],
      ...options
    };
    this.axiosInstance = axios.create({ ...this.options });

    this.axiosInstance.interceptors.response.use(response => {
      if (response.data.access && response.data.access.code == "NOK")
        return Promise.reject({
          message: "Aeroweb : Wrong Credential",
          ...response
        });
      else if (response.data.ERREUR)
        return Promise.reject({
          message: "Aeroweb : Wrong query",
          ...response
        });
      return response;
    }, (error) => { return Promise.reject(error); });
  }

  OPMET(codes, options) {
    return this.request(
      "OPMET",
      {
        METAR: "oui",
        TAF: "deux",
        LIEUID: this.pipe(...codes)
      },
      {
        transformResponse: [
          ...this.axiosInstance.defaults.transformResponse,
          this.groupByMessage
        ],
        ...options
      }
    );
  }
  SIGMET(codes, options) {
    return this.request(
      "SIGMET",
      {
        LIEUID: this.pipe(...codes)
      },
      {
        transformResponse: [
          ...this.axiosInstance.defaults.transformResponse,
          this.groupByMessage
        ],
        ...options
      }
    );
  }
  VAA(codes, options) {
    return this.request(
      "VAA",
      {
        LIEUID: this.pipe(...codes)
      },
      {
        transformResponse: [
          ...this.axiosInstance.defaults.transformResponse,
          this.groupByMessage
        ],
        ...options
      }
    );
  }
  VAG(codes, options) {
    return this.request(
      "VAG",
      {
        LIEUID: this.pipe(...codes)
      },
      {
        transformResponse: [
          ...this.axiosInstance.defaults.transformResponse,
          this.flattenMaps
        ],
        ...options
      }
    );
  }
  TCA(codes, options) {
    return this.request(
      "TCA",
      {
        LIEUID: this.pipe(...codes)
      },
      {
        transformResponse: [
          ...this.axiosInstance.defaults.transformResponse,
          this.groupByMessage
        ],
        ...options
      }
    );
  }
  TCAG(codes, options) {
    return this.request(
      "TCAG",
      {
        LIEUID: this.pipe(...codes)
      },
      options
    );
  }
  MAA(codes, options) {
    return this.request(
      "MAA",
      {
        LIEUID: this.pipe(...codes)
      },
      options
    );
  }
  PREDEC(codes, options) {
    return this.request(
      "PREDEC",
      {
        LIEUID: this.pipe(...codes)
      },
      options
    );
  }
  CARTES(zone, type, alt, options) {
    let params = {};
    if (!zone && !type && !alt) params.BASE_COMPLETE = "oui";
    else {
      if (zone) params.ZONE = zone;
      if (type) params.VUE_CARTE = type;
      if (alt) params.ALTITUDE = alt;
    }

    return this.request("CARTES", params, {
      transformResponse: [
        ...this.axiosInstance.defaults.transformResponse,
        this.flattenMaps
      ],
      ...options
    });
  }
  DOSSIER(destination, options) {
    return this.request(
      "DOSSIER",
      {
        DESTINATION: destination
      },
      options
    );
  }
  SW(options) {
    return this.request("SW", {}, options);
  }
  VALIDATION(code) {
    return this.request(
      "VALIDATION",
      {
        CODE_METEO: code
      },
      {
        transformResponse: [
          ...this.axiosInstance.defaults.transformResponse,
          data => (data.validation.resultat == "OK" ? true : false)
        ]
      }
    );
  }

  request(type, params, options) {
    return this.axiosInstance.request({
      params: {
        ...this.axiosInstance.defaults.params, // Could be removed with axios 0.20 https://github.com/axios/axios/pull/2656
        TYPE_DONNEES: type,
        ...params
      },
      ...options
    });
  }

  pipe(...codes) {
    return codes.join("|");
  }

  groupByMessage(data) {
    if (!data.groupe) return data;
    return [data.groupe.messages].flat().map(function (station) {
      return {
        ...{ oaci: station.oaci, nom: station.nom },
        ...AeroWeb.groupeBy([station.message].flat(), "type", m => m.texte)
      };
    });
  }
  flattenMaps(data) {
    if (!data.cartes) return data;
    return [data.cartes.bloc_zone]
      .flat()
      .map(z => z.carte)
      .flat();
  }
  extractZones(data) {
    return data.cartes.bloc_zone.map(bz => {
      return { id: bz.idz, name: bz.nom };
    });
  }
  extractMaps(data) {
    let zones = AeroWeb.groupeBy(data.cartes.bloc_zone, "idz", bz => bz.carte);
    for (const property in zones) {
      zones[property] = zones[property].flat();
      zones[property] = AeroWeb.groupeBy(
        zones[property],
        "type",
        c => c.niveau
      );
      for (const type in zones[property]) {
        zones[property][type] = [...new Set(zones[property][type])];
      }
    }
    return zones;
  }

  static groupeBy(xs, key, callback) {
    return xs.reduce(function (rv, x) {
      if (x) (rv[x[key]] = rv[x[key]] || []).push(callback.call(null, x));
      return rv;
    }, {});
  }
  static sanitizeAttributes(data) {
    for (const property in data) {
      if (data[property]._attributes) {
        data[property] = { ...data[property], ...data[property]._attributes };
        delete data[property]._attributes;
      }
      if (data[property]._text) data[property] = data[property]._text;
      if (data[property]._cdata) data[property] = data[property]._cdata;
      if (property == "lien") data[property] = AeroWeb.baseURL + data[property];
      if (
        data[property] &&
        (typeof data[property] === "object" || Array.isArray(data[property]))
      )
        AeroWeb.sanitizeAttributes(data[property]);
    }
    return data;
  }

  static get baseURL() {
    return "https://aviation.meteo.fr/";
  }
  static get pathname() {
    return "FR/aviation/serveur_donnees.jsp";
  }

  static get VAA() {
    return {
      PAWU: "Anchorage",
      ADRM: "Darwin",
      EGRR: "London",
      CWAO: "Montreal",
      RJTD: "Tokyo",
      LFPW: "Toulouse",
      KNES: "Washington",
      SABM: "Buenos Aires",
      NZKL: "Wellington"
    };
  }
  static get VAG() {
    return {
      PAWU: "Anchorage",
      ADRM: "Darwin",
      EGRR: "London",
      CWAO: "Montreal",
      RJTD: "Tokyo",
      LFPW: "Toulouse",
      KNES: "Washington"
    };
  }
  static get TCA() {
    return {
      FMEE: "La Réunion",
      KNHC: "Miami",
      RJTD: "Tokyo",
      PHFO: "Honolulu",
      VIDP: "New Delhi",
      NFFN: "Nadi",
      ADRM: "Darwin"
    };
  }
  static get TCAG() {
    return {
      FMEE: "La Réunion"
    };
  }
  static get PREDEC() {
    return {
      LFPG: "CDG",
      LFPO: "Orly",
      SOCA: "Cayenne",
      TFFF: "Fort de France",
      TFFR: "Pointe à pitre",
      FMEE: "Saint Denis",
      NWWW: "Nouméa",
      NTAA: "Tahiti"
    };
  }

  static get CARTES() {
    return {
      zones: {
        AERO_FRANCE: "FRANCE",
        AERO_EUROC: "EUROC",
        AERO_EUR: "EUR",
        AERO_ANTILLES: "ANTILLES",
        AERO_ANTIL_GUY: "ANTILLES GUYANE",
        AERO_DIRAG_ATL: "ANTILLES-GUYANE-AMERIQUES",
        AERO_ATLANTIQUE: "ANTILLES-GUYANE-ATLANTIQUE",
        AERO_GUYANE: "GUYANE",
        AERO_MASCAREIG: "MASCAREIGNES",
        "AERO_DIRNC-AUSTRALIE": "NOUVELLE_CALEDONIE-AUSTRALIE",
        AERO_JAPON: "NOUVELLE_CALEDONIE-JAPON",
        AERO_MAGENTA: "NOUVELLE_CALEDONIE-MAGENTA",
        AERO_NANDI_WALLIS: "NOUVELLE_CALEDONIE-NANDI_WALLIS",
        AERO_NORFOLK: "NOUVELLE_CALEDONIE-NORFOLK",
        AERO_NOUVELLE_ZELANDE: "NOUVELLE_CALEDONIE-NOUVELLE_ZELANDE",
        AERO_SAIPAN: "NOUVELLE_CALEDONIE-SAIPAN",
        AERO_TAHITI: "NOUVELLE_CALEDONIE-TAHITI",
        AERO_WALLIS: "NOUVELLE_CALEDONIE-WALLIS",
        AERO_PAC_EST: "PACIFIQUE EST",
        AERO_PAC_OUEST: "PACIFIQUE OUEST",
        AERO_POLYNESIE: "POLYNESIE",
        "AERO_TAHITI-HAWAI-JAPON": "TAHITI-HAWAI-JAPON",
        "AERO_TAHITI-EASTER_ISLAND-CHILI": "TAHITI-EASTER_ISLAND-CHILI",
        "AERO_TAHITI-POLYNESIE-FRANCAISE": "TAHITI-POLYNESIE-FRANCAISE",
        AERO_AUSTRALIE: "AUSTRALIE",
        AERO_EURASIA: "ASIA (D)",
        AERO_ASIA_SOUTH: "ASIA SOUTH",
        AERO_MEA: "ASIA SOUTH_MID",
        AERO_EURAFI: "EURAFI C",
        AERO_EURSAM_B: "EURSAM B",
        AERO_EURSAM_B1: "EURSAM B1",
        AERO_INDOC: "INDOC E",
        AERO_MID: "MID G",
        AERO_AMERIQUES: "NAMSAM A",
        AERO_NORTH_ATL: "NAT",
        AERO_NAT: "NAT H",
        AERO_NATsecour: "NAT H Secours",
        AERO_NORTH_PAC: "NORTH PACIFIC M",
        AERO_PACIF: "PACIF I",
        AERO_PACIFIC: "PACIFIC F",
        AERO_SIO: "SIO K",
        AERO_SOUTH_POL: "SOUTH POLAR J"
      },
      types: {
        AERO_TEMSI: "Temps Significatif (TEMSI)",
        AERO_WINTEM: "Vent & Température (WINTEM)"
      },
      altitudes: [
        20,
        50,
        80,
        100,
        140,
        180,
        210,
        240,
        270,
        300,
        320,
        340,
        360,
        390,
        410,
        450,
        480,
        530
      ]
    };
  }
}
