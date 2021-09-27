<template>
  <b-field>
    <p class="control" v-if="navigation">
      <NavigationManager v-bind="{ ...navigation, ...dropdown }">
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
    <p class="control" v-if="aircraft">
      <AircraftManager v-bind="{ ...aircraft, ...dropdown }">
        <template #header="{ selected }">
          {{ selected.registration }}
        </template>
      </AircraftManager>
    </p>
    <p class="control" v-if="flight">
      <FlightManager v-bind="{ ...flight, ...dropdown }">
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
  name: "DataToolbox",
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
