<template>
  <section>
    <b-button
      @click="value.unshift(JSON.parse(JSON.stringify(proto)))"
      type="is-primary"
      rounded
      >Create a checklist</b-button
    >
    <div class="control">
      <div v-for="(checklist, index) in value" :key="index">
        <b-field label="Name" label-position="on-border" horizontal>
          <b-input v-model="checklist.name" />
          <p class="control">
            <b-button @click="value.splice(index, 1)" icon-right="close" />
          </p>
        </b-field>
        <b-field
          v-for="(item, index) in checklist.items"
          :key="index"
          horizontal
        >
          <b-input v-model="item.name" placeholder="name" />
          <b-input v-model="item.expect" placeholder="expectation" />
          <b-field>
            <b-checkbox-button
              v-model="item.action"
              :native-value="true"
              type="is-primary"
              >Action</b-checkbox-button
            >
          </b-field>
          <p class="control">
            <b-button
              @click="checklist.items.splice(index, 1)"
              type="is-secondary"
              icon-right="close"
            />
          </p>
        </b-field>
        <b-field position="is-centered">
          <b-button
            @click="
              checklist.items.push(JSON.parse(JSON.stringify(proto_item)))
            "
            type="is-primary"
            rounded
            icon-right="plus"
          />
        </b-field>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: "AircraftDetailChecklists",
  props: {
    value: {
      default() {
        return [
          {
            name: undefined,
            items: [
              {
                name: undefined,
                expect: undefined,
                action: false
              }
            ]
          }
        ];
      }
    }
  },
  data() {
    return {
      proto: {
        name: undefined,
        items: [{ ...this.proto_item }]
      },
      proto_item: {
        name: undefined,
        expect: undefined,
        action: false
      }
    };
  },
  watch: {
    value: {
      deep: true,
      handler(oldVal, newVal) {
        this.$emit("input", newVal);
      }
    }
  }
};
</script>
