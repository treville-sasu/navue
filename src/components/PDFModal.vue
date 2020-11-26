<template>
  <b-modal trap-focus :destroy-on-hide="true" v-model="gotURL">
    <div class="card">
      <div class="card-header has-text-centered">
        <b-progress
          v-if="progress >= 0 && progress < 1"
          :value="progress"
          :max="1"
          show-value
          format="percent"
        ></b-progress>
        <b-pagination
          v-if="pageCount > 1"
          v-model="currentPage"
          :total="pageCount"
          :per-page="1"
          :rounded="true"
          order="is-centered"
          size="is-small"
        />
      </div>
      <div class="card-content" v-if="progress === null">
        <p class="title">Error</p>
        <p class="heading">Cannot get the file. check your connection.</p>
        <b-icon icon="alert-circle-outline" size="is-large" type="is-danger" />
      </div>
      <div v-else class="card-image">
        <pdf
          :src="value"
          :page="currentPage"
          @num-pages="pageCount = $event"
          @progress="progress = $event"
          @error="progress = null"
        />
      </div>
    </div>
  </b-modal>
</template>

<script>
import Pdf from "vue-pdf";

export default {
  name: "PDFModal",
  components: {
    Pdf
  },
  props: ["value"],
  data() {
    return {
      progress: 0,
      pageCount: null,
      currentPage: 1
    };
  },
  watch: {
    value() {
      this.pageCount = null;
      this.currentPage = 1;
    }
  },
  computed: {
    gotURL: {
      set(val) {
        this.$emit("input", val);
      },
      get() {
        return !!this.value;
      }
    }
  }
};
</script>
