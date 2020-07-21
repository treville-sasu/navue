<template>
  <section class="hero is-primary is-fullheight-with-navbar">
    <div class="hero-head"></div>

    <div class="hero-body">
      <div class="container">
        <div class="columns is-vcentered">
          <div class="column">
            <figure class="image is-square">
              <img src="@/assets/logo-transparent.svg" />
            </figure>
          </div>
          <div class="column is-two-thirds has-text-centered">
            <h1 class="title">naVue</h1>
            <h2 class="subtitle">
              Easy, Secure & Free. Just fly !
            </h2>
          </div>
        </div>
      </div>
    </div>
    <div class="hero-foot">
      <nav class="tabs">
        <div class="container">
          <ul>
            <li><router-link to="/help">Get Help</router-link></li>
            <li><router-link to="/about">About</router-link></li>
            <li><a>Source Code</a></li>
            <li><router-link to="/legal">Legal</router-link></li>
          </ul>
        </div>
      </nav>
    </div>
  </section>
</template>
<script>
export default {
  name: "Home"
};
</script>
