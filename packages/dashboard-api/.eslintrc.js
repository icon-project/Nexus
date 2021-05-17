module.exports = {
  'env': {
    'es6': true,
    'node': true
  },
  'extends': [
    'eslint:recommended' // eslint
  ],
  'parser': 'babel-eslint',
  'parserOptions': {
    'ecmaVersion': 6
  },
  'plugins': [
    'jest'
  ],
  'rules': {
    'no-console': 1,
    'no-unused-vars': 1,
    'indent': [
      'warn',
      2
    ],
    'quotes': [
      'error',
      'single'
    ],
    'semi': [
      'warn',
      'always',
    ]
  }
};
