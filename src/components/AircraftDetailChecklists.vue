<template>
  <section class="section">
    <b-button
      @click="appendItem(checklists, proto.checklists[0])"
      type="is-primary"
      rounded
    >Create a checklist</b-button>
    <div class="control">
      <div v-for="(checklist, index) in checklists" :key="index">
        <b-field label="Name" label-position="on-border" horizontal>
          <b-input v-model="checklist.name" />
          <p class="control">
            <b-button @click="removeItem(checklists, index)" icon-right="close" />
          </p>
        </b-field>
        <b-field v-for="(item, index) in checklist.items" :key="index" horizontal>
          <b-input v-model="item.name" placeholder="name" />
          <b-input v-model="item.expect" placeholder="expectation" />
          <b-field>
            <b-checkbox-button v-model="item.action" :native-value="true" type="is-primary">Action</b-checkbox-button>
          </b-field>
          <p class="control">
            <b-button
              @click="removeItem(checklist.items, index)"
              type="is-secondary"
              icon-right="close"
            />
          </p>
        </b-field>
        <b-field position="is-centered">
          <b-button
            @click="
                    appendItem(checklist.items, proto.checklists[0].items[0])
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
import { TypeCasting } from "@/mixins/apputils";

export default {
  name: "AircraftDetailChecklists",
  props: ["checklists"],
  mixins: [TypeCasting]
};
</script>
