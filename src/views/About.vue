<template>
  <section class="section">
    <h1 class="title">All about <b>naVue</b>...</h1>
    <div class="tile is-ancestor">
      <div class="tile is-4 is-vertical is-parent">
        <div class="tile is-child box">
          <h2 class="title">What is it ?</h2>
          <p class="block">
            <b>naVue</b> is an open source software dedicated to VFR pilots who
            need to prepare a flight with ease.
          </p>
          <p class="block">
            Gather all your flight information on very few clicks. Collect data
            on your flight. use it for briefing and debriefing.
          </p>
          <p class="block">
            With navue we aim at a multiplatform, directly usable (no
            installation, no dowload, no update), source of information, and
            quick route planning.
          </p>
          <p class="block">
            Modern web technology allow for in browser experience very similar
            as insalled app. For support and compatibility check your browser
            <router-link to="#compat">here</router-link>
          </p>
        </div>
        <div class="tile is-child box">
          <h2 class="title">Who build it ?</h2>
          <p class="block">
            As a fresh private pilot, and as advanced internet user, I found a
            lack of good, easly & directly usable product for VFR flight.
          </p>
          <p class="block">
            As any open source project you can contribute to it.
          </p>
          <b-button
            tag="a"
            href="https://github.com/treville-sasu/navue"
            target="_blank"
            icon-left="github"
            size="is-large"
          >
            Get Involved !
          </b-button>
        </div>
      </div>
      <div class="tile is-vertical is-parent">
        <div id="compat" class="tile is-child box">
          <h2 class="title">Compatibility & browser support</h2>
          <p class="block">
            <b>naVue</b> use latest technologies and needs a modern browser.
            You'll find below a compatibility check for your current browser,
            and some proposals for best experience.
          </p>
          <!-- <b-collapse :open="false"> -->
          <button
            class="button is-primary"
            @click="isBrowserCheckActive = true"
          >
            Check my browser
          </button>
          <b-modal v-model="isBrowserCheckActive" trap-focus can-cancel>
            <browser-check />
          </b-modal>
          <!-- </b-collapse> -->
          <div class="notification is-primary is-light">
            <p class="block">
              Currently we aim to support the last three versions of the three
              major browser : Chrome, Firefox and Edge.
            </p>
            <p class="block">
              We explicitly exlude : Internet Explorer, Baidu browser & Opera
              Mini.
            </p>
          </div>
        </div>
      </div>
      <div class="tile is-vertical is-parent" id="legal">
        <div class="tile is-child box">
          <h1 class="title">Liability.</h1>
          <h2 class="subtitle has-text-warning	">
            Always use offical documentation.
          </h2>
          <p class="block">
            As a pilot in command you will be the only liable person of your
            flight and aircraft. You are responsible for the documents and
            informations you use in flight.
          </p>
          <p class="block">
            We gather imformations in our best abilities, but important
            informations may be missing or outdated.
          </p>
        </div>
        <div class="tile is-child box">
          <h2 class="title">Licences</h2>
          <p class="block">
            https://fontawesome.com/license
          </p>
          <p class="block">
            Vuejs, Leaflet, Mapbox, ... Meteofrance, SIA
            https://materialdesignicons.com/
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import BrowserCheck from "@/components/BrowserCheck.vue";
export default {
  name: "About",
  components: { BrowserCheck },
  data() {
    return {
      isBrowserCheckActive: false,
    };
  },
};
</script>
