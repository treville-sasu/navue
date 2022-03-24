<template>
  <div class="container">
    <nav class="level">
      <div class="level-item has-text-centered">
        <div>
          <p class="heading">Aircrafts</p>
          <p class="title">{{ userStats.Aircraft || 0 }}</p>
        </div>
      </div>
      <div class="level-item has-text-centered">
        <div>
          <p class="heading">Navigations</p>
          <p class="title">{{ userStats.Navigation || 0 }}</p>
        </div>
      </div>
      <div class="level-item has-text-centered">
        <div>
          <p class="heading">Flights</p>
          <p class="title">{{ userStats.Flight || 0 }}</p>
        </div>
      </div>
      <div class="level-item has-text-centered">
        <div>
          <p class="heading">Storage</p>
          <p class="title">{{ (userStats.storage || 0) | percent }}</p>
        </div>
      </div>
    </nav>
    <b-loading :is-full-page="false" :active="!!error" />
    <fieldset v-if="!currentUser">
      <b-field label="Email" horizontal>
        <b-input
          v-model="username"
          type="email"
          icon="email"
          placeholder="pilote@navue.io"
          required
        />
      </b-field>
      <b-field label="Password" horizontal>
        <b-input
          v-model="password"
          type="password"
          icon="lock"
          placeholder="*******"
          required
          password-reveal
        />
      </b-field>
      <b-field is-grouped>
        <b-button
          @click="loginUser(username, password)"
          class="is-primary"
          icon-left="account-arrow-left-outline"
          expanded
          >Sign in</b-button
        >
        <b-button
          @click="createUser(username, password)"
          class="is-primary is-light"
          icon-left="account-plus-outline"
          >Create Account</b-button
        >
        <b-button
          v-if="gotLocalData"
          @click="cleanLocal"
          class="is-danger is-light"
          icon-left="database-remove"
          >Clear device</b-button
        >
      </b-field>
    </fieldset>
    <div v-else>
      <nav class="level is-mobile">
        <div class="level-item has-text-centered">
          <b-icon :icon="syncIcons[syncStatus]" />
        </div>
        <div class="level-item has-text-centered">
          <h5 class="title is-5">{{ currentUser.name }}</h5>
        </div>
      </nav>
      <nav class="level">
        <div class="level-item has-text-centered">
          <b-button
            @click="logoutUser"
            type="is-primary"
            icon-left="account-arrow-right-outline"
            >Sign out</b-button
          >
        </div>
        <div class="level-item has-text-centered">
          <b-button
            @click="openDetails"
            type="is-primary is-light"
            icon-left="account-edit-outline"
            >Edit</b-button
          >
        </div>
      </nav>
    </div>
  </div>
</template>

<style>
.fade {
  animation: pulse 3s infinite ease-in-out;
}
@keyframes pulse {
  0% {
    opacity: 0.2;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0.2;
  }
}
</style>

<script>
import UserDetails from "@/components/modals/UserDetails.vue";
import { UserAccount } from "@/mixins/UserAccount.js";
import { UIHelpers } from "@/mixins/apputils";

export default {
  name: "Login",
  mixins: [UserAccount, UIHelpers],
  data() {
    return {
      statsFeed: undefined,
      username: null,
      password: null,
      userStats: {},
      importData: {
        title: "Import data",
        type: "is-warning",
        message:
          "Some data are present in this device. Would you like to import them into your account ?",
        confirmText: "Yes",
        cancelText: "No"
      },
      syncStatus: "complete",
      syncIcons: {
        active: "cloud-sync-outline fade",
        change: "cloud-sync-outline fade",
        paused: "cloud-check-outline",
        complete: "cloud-off-outline",
        error: "weather-cloudy-alert",
        denied: "weather-cloudy-alert"
      },
      serverPresent: undefined,
      error: false
    };
  },
  async mounted() {
    this.serverPresent = await this.checkServer("navue");
  },
  async created() {
    await this.setupUser();
  },
  beforeDestroy() {
    if (this.statsFeed) this.statsFeed.cancel();
  },
  computed: {
    gotLocalData() {
      return (
        this.userStats.constructor === Object &&
        Object.keys(this.userStats).length > 1
      );
    }
  },
  methods: {
    async checkServer(user) {
      // TODO Should use background sync for better perception.
      try {
        clearTimeout(this.error);
        this.error = false;
        return await this.remoteDB.info();
      } catch (err) {
        this.error = setTimeout(this.checkServer, 3000, user);
      }
    },
    async createUser(username, password) {
      try {
        await this.remoteDB.signUp(username, password, {
          metadata: { created_at: new Date() }
        });
        this.openWarning({ message: "Welcome on navue !", duration: 5000 });
        await this.loginUser(username, password);
      } catch (e) {
        this.openWarning(e);
      }
    },
    async setupUser() {
      try {
        this.setUserStats();
        this.setStatsFeed();
        const userDB = await this.setCurrentUser();
        if (userDB) {
          await this.startSync(userDB, this.syncHandler);
          return true;
        }
      } catch (e) {
        console.error(e);
      }
    },
    async loginUser(username, password) {
      this.stopSync();
      try {
        await this.remoteDB.logIn(username, password);
        if (this.gotLocalData) {
          const { result } = await this.confirmAction(this.importData);
          if (!result) this.cleanLocal();
        }
        await this.setupUser();

        this.openWarning({ message: "You're in !", duration: 1000 });
        this.username = this.password = null;
      } catch (e) {
        this.openWarning(e);
      }
    },
    async logoutUser() {
      this.stopSync();
      try {
        await this.remoteDB.logOut();
        this.currentUser = undefined;
        this.openWarning({ message: "You're out !", duration: 1000 });
      } catch (e) {
        this.openWarning(e);
      } finally {
        this.cleanLocal();
      }
    },
    setStatsFeed() {
      this.statsFeed = this.$pouch
        .getDB()
        .on("destroyed", e => {
          if (e) {
            this.$pouch.getDB();
            if (this.statsFeed) this.statsFeed.cancel();
            this.setUserStats();
            this.statsFeed = this.setStatsFeed();
          }
        })
        .changes({
          since: "now",
          live: true,
          view: "user/count-items",
          filter: "_view"
        })
        .on("change", this.setUserStats);
    },
    async setUserStats() {
      this.userStats = await this.getUserStats(this.$pouch);
    },
    async checkSession() {
      try {
        return await this.setCurrentUser();
      } catch {
        this.logoutUser();
      }
    },
    syncHandler(type, e) {
      this.syncStatus = type;
      if (type in ["error", "denied"]) this.openWarning(e);
    },
    openDetails() {
      this.modal = this.$buefy.modal.open({
        parent: this,
        component: UserDetails,
        props: { user: this.currentUser },
        events: { "update:user": this.checkSession },
        hasModalCard: false,
        trapFocus: true,
        "append-to-body": true
      });
    }
  },
  filters: {
    percent(value) {
      return `${Math.ceil(value * 100)}%`;
    }
  }
};
</script>
