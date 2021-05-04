<template>
  <b-taginput
    v-model="codes"
    autocomplete
    :data="filteredList"
    @typing="updateList"
    icon="label-multiple-outline"
    placeholder="ICAO code or name"
    field="id"
    :maxlength="4"
    :maxtags="50"
    v-bind="$attrs"
    v-on="$listeners"
  >
    <template slot-scope="props">
      <b-icon :icon="icons[props.option.type]" size="is-small" />
      <strong> {{ props.option.id }} </strong>: <i>{{ props.option.name }}</i>
    </template>
    <template slot="empty"> Code not found. </template>
  </b-taginput>
</template>

<script>
// code listes are extracted from SIA download package.
//var matrix = [vaerosoussection, vaeroportlong];
//let transpose = Object.keys(matrix[0]).map(colNumber => matrix.map(rowNumber => rowNumber[colNumber]));
//return transpose.map(item => ({ id: item[0], name: item[1], type: "heliport" }))

//TODO : allow parent v-model to fill current input

export default {
  name: "BIcao",
  props: {
    data: {
      default() {
        return require("@/store/vac.json");
      }
    }
  },
  data() {
    return {
      codes: [],
      filteredList: [],
      icons: {
        airport: "airport",
        helistation: "helicopter",
        fir: "hexagon-outline",
        "weather-station": "windsock"
      }
    };
  },
  watch: {
    codes(newVal) {
      this.$emit("input", newVal);
    }
  },
  methods: {
    updateList(text) {
      this.filteredList = this.data.filter(option => {
        return (
          option.name
            .toString()
            .toLowerCase()
            .indexOf(text.toLowerCase()) >= 0 ||
          option.id
            .toString()
            .toLowerCase()
            .indexOf(text.toLowerCase()) >= 0
        );
      });
    }
  }
};
</script>
