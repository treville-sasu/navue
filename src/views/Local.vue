<template>
  <section>
    <section class="hero is-primary is-hidden-mobile is-hidden-printer">
      <div class="hero-body">
        <div class="container">
          <h1 class="title">Quick search</h1>
          <h2 class="subtitle">
            Get METAR, TAF, Notam, Azba at a glance.
          </h2>
          <nav class="level">
            <div class="level-left">
              <div class="level-item">
                <b-button icon-right="reload" @click="update"
                  >Reload data</b-button
                >
              </div>
              <div class="level-item">
                <p class="subtitle is-5">
                  checked <strong>{{ queryAge }}</strong> minute{{
                    queryAge > 1 ? "s" : ""
                  }}
                  ago
                </p>
              </div>
            </div>
            <p class="level-item">
              <b-button icon-right="printer" @click="print"
                >Print Page</b-button
              >
            </p>
            <div class="level-right">
              <p class="level-item">
                <b-button icon-right="bookmark-plus">Add to bookmark</b-button>
              </p>
            </div>
          </nav>
        </div>
      </div>
    </section>
    <section class="section">
      <h2 class="title">METAR & TAF</h2>
      <AerowebBulletin :key="reloadDate" />
    </section>
    <section class="section">
      <h2 class="title">Forecast Charts</h2>
      <AerowebCharts :key="reloadDate" />
    </section>
    <section class="section">
      <h2 class="title">Visual Approach Charts</h2>
      <SiaVac :key="reloadDate" />
    </section>
    <section class="section">
      <h2 class="title">Notam</h2>
      <SiaNotam :key="reloadDate" />
    </section>
    <section class="section">
      <h2 class="title">RTBA - AZBA</h2>
      <SiaAzba :key="reloadDate" />
    </section>
  </section>
</template>

<style scoped>
.select select {
  text-overflow: ellipsis;
  overflow: hidden;
}
</style>

<script>
import AerowebBulletin from "@/components/reports/AerowebBulletin.vue";
import AerowebCharts from "@/components/reports/AerowebCharts.vue";
import SiaVac from "@/components/reports/SiaVac.vue";
import SiaNotam from "@/components/reports/SiaNotam.vue";
import SiaAzba from "@/components/reports/SiaAzba.vue";

export default {
  name: "Local",
  components: {
    AerowebBulletin,
    AerowebCharts,
    SiaVac,
    SiaNotam,
    SiaAzba
  },
  data: function() {
    return {
      reloadDate: Date.now(),
      timers: [],
      currentDate: Date.now()
    };
  },
  beforeCreate() {
    try {
      let query = JSON.parse(
        Buffer.from(this.$route.hash.slice(1), "base64").toString("utf8"),
        (_, v) => (isNaN(Date.parse(v)) ? v : new Date(Date.parse(v)))
      );
      if (this.$route.hash) this.$store.commit("currentQueries", query);
    } catch {
      console.error("error in link. set a new search");
    }
  },
  created() {
    this.timers.push(setInterval(this.update, 15 * 60 * 1000));
    this.timers.push(
      setInterval(() => {
        this.currentDate = Date.now();
      }, 60 * 1000)
    );
  },
  unmounted() {
    this.timers.forEach(clearInterval);
  },
  computed: {
    hash() {
      return this.encode(this.$store.state.currentQueries);
    },
    queryAge() {
      return Math.floor((this.currentDate - this.reloadDate) / 1000 / 60);
    }
  },
  watch: {
    hash(hash) {
      this.$router.push({ hash: "#" + hash });
    }
  },
  methods: {
    update() {
      this.reloadDate = Date.now();
      this.currentDate = Date.now();
    },
    encode(obj) {
      return Buffer.from(JSON.stringify(obj), "utf-8").toString("base64");
    },
    print() {
      window.print();
    }
  }
};
</script>
