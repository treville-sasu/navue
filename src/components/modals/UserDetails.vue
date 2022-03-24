<template>
  <div class="modal-card">
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
      <b-button
        type="is-primary"
        icon-left="account-edit-outline"
        @click="updateMetadata(metadata)"
        expanded
        >Save</b-button
      >
      <div class="divider is-danger">Danger Zone</div>
      <b-field type="is-warning">
        <b-input
          v-model="newPassword"
          type="password"
          password-reveal
          expanded
          autocomplete="new-password"
          icon="account-key"
        />
        <p class="control">
          <b-button
            type="is-warning is-light"
            icon-left="lock-reset"
            @click="confirmAndupdatePassword(newPassword)"
            >Change Password</b-button
          >
        </p>
      </b-field>
      <b-button
        expanded
        @click="confirmAnddeleteUser()"
        type="is-danger"
        icon-left="account-remove"
        >Delete Account</b-button
      >
    </fieldset>
    <footer class="modal-card-foot">
      Member since {{ value.created_at | asDate }}
    </footer>
  </div>
</template>

<script>
import { UserAccount } from "@/mixins/UserAccount.js";
import { UIHelpers } from "@/mixins/apputils";

export default {
  name: "UserDetails",
  mixins: [UserAccount, UIHelpers],
  data() {
    return {
      value: this.user,
      newPassword: null,
      confirm: {
        deleteUser: {
          title: "Deleting account",
          message:
            "Are you sure you want to <b>delete</b> your account? This action cannot be undone.",
          confirmText: "Delete Account"
        },
        updatePassword: {
          type: "is-warning",
          title: "Change Password",
          message: "Are you sure you want to <b>change</b> current password.",
          confirmText: "Change password"
        }
      }
    };
  },
  props: ["user"],
  computed: {
    metadata() {
      // eslint-disable-next-line no-unused-vars
      const { _id, _rev, type, name, roles, ...metadata } = this.value;
      return metadata;
    }
  },
  methods: {
    async confirmAnddeleteUser() {
      const { result } = await this.confirmAction(this.confirm.deleteUser);
      if (result)
        try {
          await this.remoteDB.deleteUser(this.value.name);
          this.$emit("update:user");
          this.$emit("close");
          this.openWarning({ message: "Account deleted." });
        } catch (e) {
          this.openWarning(e);
        }
    },
    async updateMetadata(data) {
      try {
        await this.remoteDB.putUser(this.value.name, { metadata: data });
        this.$emit("update:user");
        this.$emit("close");
        this.openWarning({ message: "Account saved." });
      } catch (e) {
        this.openWarning(e);
      }
    },
    async confirmAndupdatePassword(password) {
      const { result } = await this.confirmAction(this.confirm.updatePassword);
      if (result)
        try {
          await this.remoteDB.changePassword(this.value.name, password);
          this.$emit("close");
          this.openWarning({ message: "Password changed." });
        } catch (e) {
          this.openWarning(e);
        } finally {
          this.newPassword = null;
        }
    }
  },
  filters: {
    asDate(value) {
      return new Date(value).toLocaleString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric"
      });
    }
  }
};
</script>
