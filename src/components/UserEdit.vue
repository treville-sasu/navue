<template>
  <div class="modal-card" style="width: max-content">
    <header class="modal-card-head">
      <p class="modal-card-title">{{ value.name }}</p>
      <button type="button" class="delete" @click="$emit('close')" />
    </header>
    <fieldset class="modal-card-body">
      <b-taglist>
        <b-tag
          type="is-primary"
          size="is-medium"
          :key="role"
          v-for="role in value.roles"
          >{{ role }}</b-tag
        >
      </b-taglist>
      <b-field label="Licences">
        <b-taginput
          v-model="value.licences"
          ellipsis
          icon="label"
          placeholder="Add a Licence"
          aria-close-label="Delete this tag"
        >
        </b-taginput>
      </b-field>
      <b-field label="Organization">
        <b-input v-model="value.organization" type="text" icon="domain" />
      </b-field>
      <div class="divider is-danger">Danger Zone</div>
      <b-field label="New Password" type="is-warning">
        <b-input
          v-model="newPassword"
          type="password"
          password-reveal
          autocomplete="new-password"
          icon="account-key"
        />
        <p class="control">
          <b-button
            type="is-warning is-light"
            icon-left="lock-reset"
            @click="updatePassword(value.name, newPassword)"
            >Change Password</b-button
          >
        </p>
      </b-field>
    </fieldset>
    <footer class="modal-card-foot">
      <b-button
        type="is-primary"
        icon-left="account-edit-outline"
        @click="updateUser(value.name, metadata)"
        expanded
        >Save</b-button
      >
      <b-button
        @click="deleteUser(value.name)"
        type="is-danger"
        icon-left="account-remove"
        >Delete Account</b-button
      >
    </footer>
  </div>
</template>

<script>
import { UserAccount } from "@/mixins/UserAccount.js";

export default {
  name: "UserEdit",
  mixins: [UserAccount],
  data() {
    return {
      newPassword: null,
      confirm: {
        deleteUser: {
          title: "Deleting account",
          message:
            "Are you sure you want to <b>delete</b> your account? This action cannot be undone.",
          confirmText: "Delete Account"
        },
        updatePassword: {
          title: "Change Password",
          message: "Are you sure you want to <b>change</b> current password.",
          confirmText: "Change password"
        }
      }
    };
  },
  props: ["value"],
  computed: {
    metadata() {
      return {
        licences: this.value.licences,
        organization: this.value.organization
      };
    }
  },
  methods: {
    deleteUser(name) {
      return this.confirmAction(this.confirm.deleteUser)
        .then(() => {
          return this.remoteDB.deleteUser(name);
        })
        .then(() => {
          this.$emit("update-user");
          this.$emit("close");
        })
        .catch(this.openToast);
    },
    updateUser(name, data) {
      return this.remoteDB
        .putUser(name, { metadata: data })
        .then(() => {
          this.$emit("update-user");
          this.$emit("close");
        })
        .catch(this.openToast);
    },
    updatePassword(name, password) {
      return this.confirmAction(this.confirm.updatePassword)
        .then(() => {
          return this.remoteDB.changePassword(name, password);
        })
        .then(() => {
          this.$emit("close");
        })
        .finally(() => {
          this.newPassword = null;
        })
        .catch(this.openToast);
    }
  }
};
</script>
