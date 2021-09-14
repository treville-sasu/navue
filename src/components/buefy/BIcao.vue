<template>
  <!-- <b-field grouped> -->
  <b-taginput
    :value="value"
    v-bind="$attrs"
    v-on="$listeners"
    @input="search = ''"
    @typing="updateList"
    autocomplete
    open-on-focus
    :data="shortList"
    icon="label-multiple-outline"
    placeholder="ICAO code or location name"
    field="id"
    :maxlength="4"
    :maxtags="50"
    :has-counter="false"
  >
    <template slot-scope="props">
      <b-icon :icon="icons[props.option.type]" size="is-small" />
      <strong> {{ props.option.id }} </strong>: <i>{{ props.option.name }}</i>
    </template>
    <template slot="empty">Nothing found yet</template>
  </b-taginput>
  <!-- <b-select @model="type">
      <option v-for="t in types" :value="t" :key="t">
        {{ t }}
      </option>
    </b-select>
  </b-field> -->
</template>

<script>
// code listes are extracted from SIA download package.
//var matrix = [vaerosoussection, vaeroportlong];
//let transpose = Object.keys(matrix[0]).map(colNumber => matrix.map(rowNumber => rowNumber[colNumber]));
//return transpose.map(item => ({ id: item[0], name: item[1], type: "heliport" }))

export default {
  name: "BIcao",
  props: {
    value: Array,
    data: {
      default() {
        return require("@/store/vac.json");
      }
    },
    presets: {
      type: Array,
      default: () => []
    }
    // types: {
    //   type: Array,
    //   default: () => ["airport", "weather"]
    // }
  },
  data() {
    return {
      search: undefined,
      // type: undefined,
      results: [],
      icons: {
        airport: "airport",
        helistation: "helicopter",
        fir: "hexagon-outline",
        "weather-station": "windsock"
      }
    };
  },
  computed: {
    shortList() {
      return this.search
        ? this.results
        : this.presets.map(p => this.searchQuery(p)).flat();
    }
  },
  methods: {
    updateList(text) {
      this.search = text;
      this.results = this.searchQuery(text);
    },
    searchQuery(text) {
      return this.data.filter(item => this.assertQuery(item, text));
    },
    assertQuery({ id, name }, query) {
      let reg = new RegExp(query, "i");
      return (
        // this.types.includes(type) &&
        id.search(reg) >= 0 || name.search(reg) >= 0
      );
    }
  }
};
</script>
