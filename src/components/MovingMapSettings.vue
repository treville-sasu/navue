<template>
  <b-dropdown v-bind="$attrs">
    <b-button slot="trigger">
      <b-icon icon="cog-outline" />
    </b-button>
    <b-dropdown-item custom>
      <b-switch
        v-bind:value="getLocation"
        @input="$emit('update:settings', { getLocation: $event })"
        >Use GNSS</b-switch
      >
    </b-dropdown-item>
    <b-dropdown-item custom>
      <b-switch
        v-bind:value="setView"
        :disabled="!getLocation"
        @input="$emit('update:settings', { setView: $event })"
        >Keep view centered</b-switch
      >
    </b-dropdown-item>
    <b-dropdown-item custom>
      <b-switch
        v-bind:value="fullScreen"
        @input="$emit('update:settings', { fullScreen: $event })"
        >Set Map Fullscreen</b-switch
      >
    </b-dropdown-item>
    <b-dropdown-item custom>
      <b-switch
        v-bind:value="zoomControl"
        @input="$emit('update:settings', { zoomControl: $event })"
        >Display zoom control</b-switch
      >
    </b-dropdown-item>
    <b-dropdown-item separator />
    <b-dropdown-item custom>
      <b-field label="Trace length">
        <b-numberinput
          size="is-small"
          controls-position="compact"
          :editable="false"
          step="50"
          min="10"
          v-bind:value="traceLength"
          @input="$emit('update:settings', { traceLength: $event })"
        >
        </b-numberinput>
      </b-field>
    </b-dropdown-item>
    <b-dropdown-item custom>
      <b-field label="Futur postition delay (min.)">
        <b-numberinput
          size="is-small"
          controls-position="compact"
          :editable="false"
          step="1"
          min="0"
          v-bind:value="futurPositionDelay"
          @input="$emit('update:settings', { futurPositionDelay: $event })"
        >
        </b-numberinput>
      </b-field>
    </b-dropdown-item>
    <b-dropdown-item custom>
      <b-field label="Max. accuracy allowed">
        <b-numberinput
          size="is-small"
          controls-position="compact"
          :editable="false"
          step="10"
          min="1"
          v-bind:value="maxAccuracy"
          @input="$emit('update:settings', { maxAccuracy: $event })"
        >
        </b-numberinput>
      </b-field>
    </b-dropdown-item>
    <b-dropdown-item custom>
      <b-field label="Min. spd allowed">
        <b-numberinput
          size="is-small"
          controls-position="compact"
          :editable="false"
          step=".05"
          min="0"
          v-bind:value="minSpeed"
          @input="$emit('update:settings', { minSpeed: $event })"
        >
        </b-numberinput>
      </b-field>
    </b-dropdown-item>
    <b-dropdown-item custom>
      <b-field label="Min. dist. allowed">
        <b-numberinput
          size="is-small"
          controls-position="compact"
          :editable="false"
          step="1"
          min="0"
          v-bind:value="minDistance"
          @input="$emit('update:settings', { minDistance: $event })"
        >
        </b-numberinput>
      </b-field>
    </b-dropdown-item>
    <b-dropdown-item custom>
      <b-field label="Min. destination dist.">
        <b-numberinput
          size="is-small"
          controls-position="compact"
          :editable="false"
          step="10"
          min="1"
          v-bind:value="minDestination"
          @input="$emit('update:settings', { minDestination: $event })"
        >
        </b-numberinput>
      </b-field>
    </b-dropdown-item>
  </b-dropdown>
</template>

<script>
export default {
  name: "MovingMapSettingsControl",
  props: {
    getLocation: Boolean,
    setView: Boolean,
    fullScreen: Boolean,
    zoomControl: Boolean,
    traceLength: Number,
    futurPositionDelay: Number,
    maxAccuracy: Number,
    minSpeed: Number,
    minDistance: Number,
    minDestination: Number,

    inFlight: Boolean
  }
};
</script>
