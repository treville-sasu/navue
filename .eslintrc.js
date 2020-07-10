module.exports = {
  root: true,

  env: {
    node: true
  },

  extends: ["plugin:vue/essential", "eslint:recommended", "@vue/prettier"],

  parserOptions: {
    ecmaVersion: 2020
  },

  rules: {
    'no-console': 'off',
    'no-debugger': 'off'
  },

  'extends': [
    'plugin:vue/strongly-recommended',
    'eslint:recommended',
    '@vue/prettier'
  ]
};
