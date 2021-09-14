<template>
  <article :class="card ? 'card' : 'media'">
    <div
      class="is-clickable"
      :class="card ? 'card-content' : 'media-left'"
      @click="openPDF"
    >
      <slot>
        <figure class="image">
          <pdf :src="sanitedUrl" :page="1" style="height: 100%" />
        </figure>
      </slot>
    </div>
    <div :class="card ? 'card-header' : 'media-content'">
      <p class="title is-5 heading">
        {{ name }}
      </p>
    </div>
    <div :class="card ? 'card-footer' : 'media-right'">
      <b-taglist>
        <b-tag v-for="(tag, key) in tags" :key="key" :type="'is-' + key">{{
          tag
        }}</b-tag>
      </b-taglist>
    </div>
  </article>
</template>

<script>
import MPdf from "@/components/modals/MPdf.vue";
import Pdf from "vue-pdf";

export default {
  name: "ChartCartridge",
  components: {
    // eslint-disable-next-line vue/no-unused-components
    MPdf,
    Pdf
  },
  props: {
    card: Boolean,
    name: String,
    url: [String, URL],
    tags: Object,
    type: String
  },
  computed: {
    sanitedUrl() {
      return this.url.toString();
    }
  },
  methods: {
    openPDF() {
      this.modal = this.$buefy.modal.open({
        component: MPdf,
        props: { url: this.url },
        parent: this,
        hasModalCard: true,
        // fullScreen: true,
        appendToBody: true
      });
    }
  }
};
</script>
