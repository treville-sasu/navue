<template>
  <b-field>
    <p class="control">
      <NavigationManager
        v-if="navigation"
        v-bind="{ ...navigation, ...dropdown }"
      >
        <template #header="{ selected }">
          <b-input
            v-if="navigation.edit"
            v-model="selected.name"
            placeholder="from > to"
          />
          <span v-else>
            {{ selected.name }}
          </span>
        </template>
      </NavigationManager>
    </p>
    <p class="control">
      <AircraftManager v-if="aircraft" v-bind="{ ...aircraft, ...dropdown }">
        <template #header="{ selected }">
          {{ selected.registration }}
        </template>
      </AircraftManager>
    </p>
    <p class="control">
      <FlightManager v-if="flight" v-bind="{ ...flight, ...dropdown }">
        <template #header="{ selected }">
          <b-input v-model="selected.name" placeholder="Flight n°" />
        </template>
      </FlightManager>
    </p>
  </b-field>
</template>

<script>
import NavigationManager from "@/components/managers/NavigationManager";
import AircraftManager from "@/components/managers/AircraftManager";
import FlightManager from "@/components/managers/FlightManager";

export default {
  name: "DataToolbar",
  components: {
    NavigationManager,
    AircraftManager,
    FlightManager
  },
  props: {
    navigation: [Boolean, Object],
    aircraft: [Boolean, Object],
    flight: [Boolean, Object],
    dropdown: Object
  }
};
</script>
