<template>
  <div class="box">
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
          <h4 class="title">{{ value.id }} - {{ value.name }}</h4>
          <div class="buttons">
            <b-button
              v-for="label in [
                'primary',
                'info',
                'warning',
                'succes',
                'danger',
              ]"
              :key="label"
              @click="isComponentModalActive = true"
              size="is-small"
              :type="'is-' + label"
              >{{ label }}</b-button
            >
          </div>
        </div>
      </div>
    </article>
    <b-modal
      :active.sync="isComponentModalActive"
      trap-focus
      :destroy-on-hide="true"
    >
      <b-tabs type="is-boxed">
        <b-tab-item v-for="i in numPages" :key="i" :label="i.toString()">
          <pdf :key="i" :page="i" :src="vacUrl"></pdf>
        </b-tab-item>
      </b-tabs>
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
  name: "ChartViewer",
  components: {
    pdf,
  },
  props: {
    value: Object,
  },
  data() {
    return {
      numPages: undefined,
      isComponentModalActive: false,
    };
  },
  mounted() {
    this.loadingtask.promise.then((pdf) => {
      this.numPages = pdf.numPages;
    });
  },
  computed: {
    vacUrl() {
      // return "https://www.sia.aviation-civile.gouv.fr/dvd/eAIP_18_JUN_2020/Atlas-VAC/PDF_AIPparSSection/VAC/AD/AD-2.LFDA.pdf"
      return "./AD-2.LFDA.pdf";
    },
    loadingtask() {
      return pdf.createLoadingTask(this.vacUrl);
    },
  },
};
</script>
