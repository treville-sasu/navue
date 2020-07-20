<template>
  <div class="box" @click="isModalActive = true">
    <article class="media">
      <div class="media-left">
        <figure class="image is-64x64">
          <img
            src="https://bulma.io/images/placeholders/128x128.png"
            alt="Image"
          />
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
      :active.sync="isModalActive"
      trap-focus
      :destroy-on-hide="true"
      @close="isModalActive = false"
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
    pdf
  },
  props: {
    value: Object
  },
  data() {
    return {
      isModalActive: false
    };
  },
  computed: {
    mapSrc() {
      return "https://cors.treville.workers.dev/" + this.value.lien;
    }
  }
};
</script>
