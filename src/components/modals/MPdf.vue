<template>
  <div class="modal-card">
    <div class="modal-card-head">
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
    <b-progress
      v-if="progress >= 0 && progress < 1"
      :value="progress"
      :max="1"
      show-value
      format="percent"
    ></b-progress>
    <div class="card-content" v-if="progress === null">
      <p class="title">Error</p>
      <p class="heading">Cannot get the file. check your connection.</p>
      <b-icon icon="alert-circle-outline" size="is-large" type="is-danger" />
    </div>
    <div v-else-if="url" class="card-image">
      <pdf
        :src="url.toString()"
        :page="currentPage"
        @num-pages="pageCount = $event"
        @progress="progress = $event"
        @error="progress = null"
      />
    </div>
  </div>
</template>

<script>
import Pdf from "vue-pdf";

export default {
  name: "MPdf",
  components: {
    Pdf
  },
  props: {
    url: [String, URL]
  },
  data() {
    return {
      progress: 0,
      pageCount: null,
      currentPage: 1
    };
  },
  watch: {
    url() {
      this.pageCount = null;
      this.currentPage = 1;
    }
  }
};
</script>
