import CorsProxy from "@/mixins/CorsProxy";

export default {
  mixins: [CorsProxy],
  data() {
    return {
      AZBASourceUrl: "https://www.sia.aviation-civile.gouv.fr/schedules",
      VACSourceUrl: "https://www.sia.aviation-civile.gouv.fr/"
    };
  },
  methods: {
    async fetchSIA(target) {
      const response = await fetch(this.proxyUrl(target));
      if (!response.ok) throw new Error(response.status);
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
    }
  }
};
