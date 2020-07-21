<template>
  <div class="box">
    <article class="media">
      <div class="media-left">
        <figure class="image is-64x64">
          <a href="#" @click="isComponentModalActive = true">
            <img
              src="https://bulma.io/images/placeholders/128x128.png"
              alt="Image"
            />
          </a>
        </figure>
      </div>
      <div class="media-content">
        <div class="content">
          <h4 class="title">{{ value.zone_carte }}</h4>
          <b-taglist>
            <b-tag type="is-primary">{{ value.type }}</b-tag>
            <b-tag type="is-info">{{ value.niveau }}</b-tag>
            <b-tag type="is-warning">{{ value.echeance }}</b-tag>
          </b-taglist>
        </div>
      </div>
    </article>
    <b-modal
      :active.sync="isComponentModalActive"
      trap-focus
      :destroy-on-hide="true"
    >
      <pdf :src="mapSrc" />
    </b-modal>
  </div>
</template>

<style scoped>
.modal .animation-content .modal-card {
  overflow: visible !important;
}

.modal-card-body {
  overflow: visible !important;
}
</style>

<script>
import pdf from "vue-pdf";

export default {
  name: "WeatherMaps",
  components: {
    pdf,
  },
  props: {
    value: Object,
  },
  data() {
    return {
      isComponentModalActive: false,
    };
  },
  computed: {
    mapSrc() {
      return "https://cors.treville.workers.dev/" + this.value.lien;
    },
  },
};
</script>
