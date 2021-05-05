<template>
  <b-field>
    <b-field>
      <NavigationManager v-if="navigation" v-bind="dropdown" editable>
        <template #header="{ selected }">
          {{ selected.name }}
        </template>
      </NavigationManager>
    </b-field>
    <b-field>
      <AircraftManager v-if="aircraft" v-bind="dropdown">
        <template #header="{ selected }">
          {{ selected.registration }}
        </template>
      </AircraftManager>
    </b-field>
    <b-field>
      <FlightManager
        v-if="flight"
        :traceDB="traceDB"
        persistent
        build
        v-bind="dropdown"
      >
        <template #header="{ selected }">
          <b-input v-model="selected.name" placeholder="Flight n°" />
        </template>
      </FlightManager>
    </b-field>
  </b-field>
</template>

<script>
import NavigationManager from "@/components/NavigationManager";
import AircraftManager from "@/components/AircraftManager";
import FlightManager from "@/components/FlightManager";

export default {
  name: "DataToolbar",
  components: {
    NavigationManager,
    AircraftManager,
    FlightManager
  },
  props: {
    traceDB: String,
    navigation: Boolean,
    aircraft: Boolean,
    flight: Boolean,
    dropdown: Object
  }
};
</script>
