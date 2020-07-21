<template>
  <div class="container">
    <form v-if="!logged" @submit.prevent="sign">
      <fieldset :disabled="logging" style="width: max-content;">
        <b-field label="Email">
          <b-input
            v-model="username"
            type="email"
            icon="email"
            placeholder="e.g. bobsmith@gmail.com"
            required
          />
        </b-field>
        <b-field label="Password">
          <b-input
            v-model="password"
            type="password"
            icon="lock"
            placeholder="*******"
            required
            password-reveal
          />
        </b-field>

        <div class="field">
          <b-checkbox>Remember me</b-checkbox>
        </div>
        <div class="buttons">
          <b-button
            class="is-light"
            icon-left="login"
            tag="input"
            native-type="submit"
            value="Sign in"
          />
          <b-button
            class="is-primary"
            tag="input"
            native-type="submit"
            value="Create Account"
          />
        </div>
      </fieldset>
    </form>
    <div v-else class="container">
      {{ user }}
      <span class="tag is-success is-light">Synced</span>
      <div class="buttons">
        <b-button class="is-light" icon-left="logout" @click="signout"
          >Sign out</b-button
        >
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapState } from "vuex";

export default {
  name: "Login",
  data() {
    return {
      logged: false,
      logging: false,
      user: null,
      username: null,
      password: null
    };
  },
  mounted() {
    this.syncDB();
  },
  methods: {
    sign(form) {
      switch (form.submitter.value) {
        case "Create Account":
          this.$pouch
            .createUser(this.username, this.password, this.RemoteURL)
            .then(console.log)
            .catch(console.error);
          break;
        case "Sign in":
          this.$pouch
            .connect(this.username, this.password, this.RemoteURL)
            .then(console.log)
            .catch(console.error);
          break;
      }
    },
    signout() {},
    ...mapActions(["syncDB"])
  },
  computed: {
    ...mapGetters(["RemoteURL"]),
    ...mapState(["localDB"])
  }
};
</script>
