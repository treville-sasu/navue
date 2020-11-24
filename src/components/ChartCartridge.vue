<template>
  <article class="media is-clickable" @click="$emit('click', url)">
    <div class="media-left">
      <slot></slot>
    </div>
    <div class="media-content">
      <div class="content">
        <h4 class="title">{{ name }}</h4>
        <b-taglist>
          <b-tag v-for="(tag, key) in tags" :key="key" :type="'is-' + key">{{
            tag
          }}</b-tag>
        </b-taglist>
      </div>
    </div>
  </article>
</template>
<style scoped>
.is-clickable {
  cursor: pointer !important;
}
</style>
<script>
export default {
  name: "ChartCartridge",
  props: {
    name: String,
    url: [String, URL],
    tags: Object
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
