module.exports = {
  env: {
    es6: true,
    node: true,
    jest: true,
  },
  extends: [
    'eslint:recommended', // eslint
    'plugin:jest/recommended',
  ],
  parser: 'babel-eslint',
  parserOptions: {
    ecmaVersion: 6,
  },
  plugins: ['jest'],
  settings: {
    jest: {
      version: 'latest',
    },
  },
  rules: {
    'no-console': 1,
    'no-unused-vars': 1,
    indent: ['warn', 2],
    quotes: ['error', 'single'],
    semi: ['warn', 'always'],
  },
};
