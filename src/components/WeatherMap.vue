<template>
  <div class="box">
    <a href="#" @click="isComponentModalActive = true">
      <article class="media level-item">
        <div class="media-left">
          <b-icon
            :icon="
              data.type == 'TEMSI' ? 'weather-partly-cloudy' : 'weather-windy'
            "
            size="is-large"
            type="is-primary"
          >
          </b-icon>
        </div>
        <div class="media-content">
          <div class="content">
            <h4 class="title">{{ data.zone_carte }}</h4>
            <b-taglist>
              <b-tag type="is-primary">{{ data.type }}</b-tag>
              <b-tag type="is-info">{{ data.niveau }}</b-tag>
              <b-tag type="is-warning">{{ data.echeance }}</b-tag>
            </b-taglist>
          </div>
        </div>
      </article>
    </a>
    <b-modal
      :active.sync="isComponentModalActive"
      trap-focus
      :destroy-on-hide="true"
    >
      <pdf :src="src" />
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
    data: Object,
    src: String
  },
  data() {
    return {
      isComponentModalActive: false
    };
  }
};
</script>
