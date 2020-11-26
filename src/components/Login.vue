<template>
  <div class="container" style="min-width: 30vw">
    <fieldset v-if="!currentUser">
      <b-field label="Email">
        <b-input
          v-model="username"
          type="email"
          icon="email"
          placeholder="pilote@navue.io"
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
      <b-field is-grouped>
        <b-button
          @click="loginUser(username, password)"
          class="is-primary"
          icon-left="account-arrow-left-outline"
          expanded
          >Sign in</b-button
        >
        <b-button
          @click="newUser(username, password)"
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
      <nav class="level">
        <div class="level-item has-text-centered">
          <b-icon :icon="syncIcon" />
        </div>
        <div class="level-item has-text-centered">
          <h5 class="title is-5">{{ currentUser.name }}</h5>
        </div>
      </nav>
      <nav class="level">
        <div class="level-item has-text-centered">
          <div>
            <p class="heading">Aircrafts</p>
            <p class="title">{{ userStats.aircraft || 0 }}</p>
          </div>
        </div>
        <div class="level-item has-text-centered">
          <div>
            <p class="heading">Navigations</p>
            <p class="title">{{ userStats.navigation || 0 }}</p>
          </div>
        </div>
        <div class="level-item has-text-centered">
          <div>
            <p class="heading">Flight hours</p>
            <p class="title">{{ userStats.flightduration || 0 }}</p>
          </div>
        </div>
        <div class="level-item has-text-centered">
          <div>
            <p class="heading">Storage Quota</p>
            <p class="title">{{ (userStats.quota || 0) | percent }}</p>
          </div>
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
            @click="openDetails = true"
            type="is-primary is-light"
            icon-left="account-edit-outline"
            >Edit</b-button
          >
        </div>
      </nav>
      <b-modal
        v-model="openDetails"
        v-if="currentUser"
        has-modal-card
        trap-focus
        aria-role="dialog"
        aria-modal
      >
        <template #default="props">
          <UserEdit
            v-model="currentUser"
            @close="props.close"
            @update-user="checkSession"
          ></UserEdit>
        </template>
      </b-modal>
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
import UserEdit from "@/components/UserEdit.vue";
import { UserAccount } from "@/mixins/UserAccount.js";

export default {
  name: "Login",
  components: {
    UserEdit
  },
  mixins: [UserAccount],
  data() {
    return {
      openDetails: false,
      username: null,
      password: null,
      userStats: {},
      syncIcon: "cloud-off-outline"
      // importData: {
      //   title: "Import data",
      //   type: "is-warning",
      //   message:
      //     "Some data are present in this device. Would you like to import them into your account ?",
      //   confirmText: "Import & Sync"
      // }
    };
  },
  computed: {
    currentUser: {
      get() {
        return this.$store.state.currentUser;
      },
      set(val) {
        this.$store.commit("currentUser", val);
      }
    },
    gotLocalData() {
      return (
        this.userStats.constructor === Object &&
        Object.keys(this.userStats).length > 0
      );
    }
  },
  created() {
    this.setCurrentUser()
      .then(this.startSync)
      .catch(err => {
        console.info(err.message);
      })
      .finally(this.setUserStats);
  },
  methods: {
    newUser(username, password) {
      return this.remoteDB
        .signUp(username, password)
        .then(this.loginUser(username, password))
        .catch(this.openToast);
    },
    loginUser(username, password) {
      return (
        this.remoteDB
          .logIn(username, password)
          .catch(this.openToast)
          // .then(() => this.confirmAction(this.importData))
          // .catch(this.cleanLocal)
          .then(this.setCurrentUser)
          .then(this.startSync)
          .finally(() => {
            this.username = this.password = null;
          })
      );
    },
    logoutUser() {
      return this.remoteDB
        .logOut()
        .then(this.stopSync)
        .catch(this.openToast)
        .finally(this.cleanLocal);
    },
    setCurrentUser() {
      return this.getCurrentUser().then(user => {
        this.currentUser = user;
        return this.$pouch.getDB(
          new URL(this.userDBname(user.name), this.remoteDbUrl)
        );
      });
    },
    setUserStats() {
      return this.getUserStats(this.$pouch)
        .then(stats => {
          return (this.userStats = { ...stats });
        })
        .finally(() => {
          navigator.storage.estimate().then(estimate => {
            this.userStats.quota = estimate.usage / estimate.quota;
          });
        });
    },
    checkSession() {
      return this.setCurrentUser().catch(this.logoutUser);
    },
    // startSync(userDB) {
    //   return this.$pouch
    //     .ecoSync(userDB)
    //     .then(handle => {
    //       console.log("synced ?");
    //       this.syncIcon = "cloud-sync-outline fade";
    //       this.syncHandle = handle
    //         .on("active", () => (this.syncIcon = "cloud-sync-outline fade"))
    //         .on("change", () => (this.syncIcon = "cloud-sync-outline fade"))
    //         .on("paused", () => (this.syncIcon = "cloud-check-outline"));
    //         .on("paused", this.setUserStats)
    //     })
    //     .catch(err => {
    //       this.openToast(err);
    //       this.syncIcon = "weather-cloudy-alert";
    //     });
    // },
    startSync(userDB) {
      if (this.syncHandle) this.stopSync();
      this.syncHandle = this.$pouch
        .sync(userDB)
        .on("active", () => (this.syncIcon = "cloud-sync-outline fade"))
        .on("active", () => console.info("Syncing."))
        .on("change", () => (this.syncIcon = "cloud-sync-outline fade"))
        .on("change", this.setUserStats)
        .on("paused", () => (this.syncIcon = "cloud-check-outline"))
        .on("complete", () => (this.syncIcon = "cloud-off-outline"))
        .on("error", this.openToast)
        .on("error", () => (this.syncIcon = "weather-cloudy-alert"))
        .on("denied", this.openToast)
        .on("denied", () => (this.syncIcon = "weather-cloudy-alert"));

      Promise.resolve(this.syncHandle);
    },

    cleanLocal() {
      return this.$pouch
        .destroy()
        .then(() => {
          this.userStats = {};
          this.currentUser = null;
        })
        .then(() => {
          return this.$pouch.getDB("trace").destroy();
        })
        .then(console.info("Browser cleaned."));
    }
  },
  filters: {
    percent(value) {
      return `${Math.ceil(value * 100)}%`;
    }
  }
};
</script>
