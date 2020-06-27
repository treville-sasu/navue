<template>
  <div class="container">
    <fieldset v-if="!logged" :disabled="logging" style="width: max-content;">
      <b-field label="Email">
        <b-input type="email" icon="email" placeholder="e.g. bobsmith@gmail.com" required />
      </b-field>
      <b-field label="Password">
        <b-input type="password" icon="lock" placeholder="*******" required password-reveal />
      </b-field>

      <div class="field">
        <b-checkbox>Remember me</b-checkbox>
      </div>
      <div class="buttons">
        <b-button class="is-light" icon-left="login" @click="signin">Sign in</b-button>
        <b-button class="is-primary">Create Account</b-button>
      </div>
    </fieldset>
    <div v-else class="container">
      {{user}}
      <span class="tag is-success is-light">Synced</span>
      <div class="buttons">
        <b-button class="is-light" icon-left="logout" @click="signout">Sign out</b-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Login",
  data() {
    return {
      logged: false,
      logging: false,
      user: null
    };
  },
  methods: {
    signin() {},
    signout() {}
  }
};
</script>
