<template>
  <section class="hero is-primary is-fullheight-with-navbar">
    <div class="hero-body">
      <div class="container">
        <div class="columns is-vcentered">
          <div class="column">
            <figure class="image is-square">
              <img src="@/assets/logo-transparent.svg" alt="" />
            </figure>
          </div>
          <div class="column is-two-thirds has-text-centered">
            <h1 class="title is-1">naVue</h1>
            <h2 class="subtitle is-2">
              Easy, Secure & Free. Just fly !
            </h2>
            <liability />
          </div>
        </div>
      </div>
    </div>
    <div class="hero-foot">
      <nav class="tabs">
        <div class="container">
          <ul>
            <li><router-link to="/about">About</router-link></li>
            <li><router-link to="/about#legal">Legal</router-link></li>
            <li>
              <a
                target="_blank"
                rel="noopener"
                href="https://github.com/treville-sasu/navue/issues"
                >Contribute</a
              >
            </li>
            <li>
              <a
                target="_blank"
                rel="noopener"
                href="https://github.com/treville-sasu/navue/discussions"
                >Get Help</a
              >
            </li>
            <li>
              <a
                target="_blank"
                rel="noopener"
                href="https://github.com/treville-sasu/navue"
                >Source Code</a
              >
            </li>
            <li>
              <a href="/preflight">Pre-flight</a>
            </li>
          </ul>
        </div>
      </nav>
    </div>
  </section>
</template>
<script>
import Liability from "@/components/Liability";
export default {
  name: "Home",
  components: { Liability }
};
</script>
