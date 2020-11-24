<template>
  <b-modal trap-focus :destroy-on-hide="true" v-model="gotURL" has-modal-card>
    <div class="card has-text-centered">
      <b-progress
        v-if="progress >= 0 && progress < 1"
        :value="progress"
        :max="1"
        show-value
        format="percent"
      ></b-progress>
      <div class="box" v-if="progress === null">
        <p class="title">Error</p>
        <p class="heading">Cannot get the file. check your connection.</p>
        <b-icon icon="alert-circle-outline" size="is-large" type="is-danger" />
      </div>
      <div v-else height="100px">
        <b-pagination
          v-model="currentPage"
          :total="pageCount"
          :per-page="1"
          :rounded="true"
          order="is-centered"
          size="is-small"
          aria-next-label="Next page"
          aria-previous-label="Previous page"
          aria-page-label="Page"
          aria-current-label="Current page"
        />
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
