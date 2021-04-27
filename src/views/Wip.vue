<template>
  <section>
    <section class="hero is-primary is-fullheight-with-navbar">
      <div class="hero-body">
        <div class="container">
          <h1 class="title">
            <i>{{ $route.name }}</i> is not yet operational
          </h1>

          <article class="media">
            <b-icon icon="github" size="is-large" />
            <div class="media-content">
              <div class="content">
                <p>
                  Navue is an <b>open source software</b>, you can contribute by
                  submitting bugs, issues, or by adding new features.
                </p>
                <p>
                  Come and give hand, we use github as a central place for code,
                  issues & discussions.
                </p>
              </div>
            </div>
          </article>
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
                  >Contribute</a
                >
              </li>
              <li>
                <a
                  target="_blank"
                  href="https://github.com/treville-sasu/navue/discussions"
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
  </section>
</template>

<script>
export default {
  name: "Wip"
};
</script>
