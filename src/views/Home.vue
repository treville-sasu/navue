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
            <h1 class="title is-1">naVue</h1>
            <h2 class="subtitle is-2">
              Easy, Secure & Free. Just fly !
            </h2>
            <div class="notification is-warning">
              <h1 class="title">Liability.</h1>
              <h2 class="subtitle">Always use offical documentation.</h2>
              As a pilot in command you will be the only liable person of your
              flight and aircraft. You are responsible for the documents and
              informations you use in flight.
            </div>

            <div class="notification is-danger">
              <h1 class="title">Work in progress</h1>
              <h2 class="subtitle">Evaluation only</h2>
              Do not use this software
            </div>
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
                href="https://github.com/treville-sasu/navue/issues"
                >Get Help</a
              >
            </li>
            <li>
              <a target="_blank" href="https://github.com/treville-sasu/navue"
                >Source Code</a
              >
            </li>
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
