<template>
  <article :class="card ? 'card' : 'media'">
    <div
      class="is-clickable"
      :class="card ? 'card-content' : 'media-left'"
      @click="$emit('click', url)"
    >
      <slot></slot>
    </div>
    <div :class="card ? 'card-header' : 'media-content'">
      <p class="title is-4 heading is-clickable" @click="$emit('click', url)">
        {{ name }}
      </p>
    </div>
    <div :class="card ? 'card-footer' : 'media-right'">
      <b-taglist>
        <b-tag v-for="(tag, key) in tags" :key="key" :type="'is-' + key">{{
          tag
        }}</b-tag>
        <b-tag
          type="is-primary is-light"
          closable
          attached
          :close-icon="cached ? 'cloud-check-outline' : 'cloud-off-outline'"
        />
        <!-- @close="toogleCache" -->
      </b-taglist>
    </div>
  </article>
</template>

<script>
export default {
  name: "ChartCartridge",
  props: {
    card: {
      type: Boolean,
      default() {
        return false;
      }
    },
    name: String,
    url: [String, URL],
    tags: Object
  },
  watch: {
    url: {
      immediate: true,
      async handler(val) {
        this.cached = await this.isCached(val);
      }
    }
  },
  data() {
    return { cached: false };
  },
  methods: {
    async isCached(url) {
      return !!(await caches.match(url));
    }
    // toogleCache(url) {
    //   this.$sw.messageSW({
    //     type: "CACHE_URLS",
    //     payload: { urlsToCache: [url] }
    //   });
    // }
  }
};
</script>

<docs>
  <chart-cartridge :url="" >
    <b-icon v-if="icon" :icon="icon" size="is-large" type="is-primary" />
    <figure v-if="figure" class="image is-64x64">
      <img :src="figure" alt="Image" />
    </figure>
  </chart-cartridge>
</docs>
