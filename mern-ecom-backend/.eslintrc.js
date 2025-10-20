module.exports = {
  env: { node: true, es2021: true },
  extends: ['eslint:recommended', 'plugin:node/recommended', 'prettier'],
  parserOptions: { ecmaVersion: 12 },
  rules: { 'no-console': 'off' }
};
