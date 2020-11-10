module.exports = {
  root: true,

  env: {
    node: true,
    browser: true
  },

  extends: [
    "plugin:vue/essential",
    "eslint:recommended",
    "@vue/prettier",
    "plugin:compat/recommended"
  ],

  parserOptions: {
    ecmaVersion: 2020
  },
  rules: {
    "no-console": "off",
    "no-debugger": "off"
  }
};
