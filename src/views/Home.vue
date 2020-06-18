<template>
  <div class="container">
    <section class="hero is-primary">
      <div class="container">
        <h1 class="title">NaVue</h1>
        <h2 class="subtitle">
          A simple flight tool, for preparation, navigation, and monitoring a
          flight.
        </h2>
        <div class="container">
          <figure class="image is-128x128">
            <img src="favicon.png" />
          </figure>
        </div>
      </div>
    </section>
    <Step msg="Welcome to Your Vue.js App" />
  </div>
</template>

<script>
// @ is an alias to /src
import Step from "@/components/Step.vue";

export default {
  name: "Home",
  components: {
    Step
  }
};
</script>
