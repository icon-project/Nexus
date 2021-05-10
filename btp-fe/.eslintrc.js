const { resolve } = require("path");

const baseExtends = [
  "eslint:recommended",
  "plugin:react/recommended",
  "plugin:import/errors",
  "plugin:jsx-a11y/recommended",
];

const reactJSExtends = [].concat.apply(baseExtends, ["prettier"]);

// Plugins
const basePlugins = [
  "import",
  "jsx-a11y",
  "react",
  "react-hooks",
  // "sort-keys-fix",
  "sort-class-members",
  "prettier",
  "@emotion",
];

// Rules Options
const importOrderOptions = {
  alphabetize: { caseInsensitive: false, order: "asc" },
  groups: ["builtin", "external", "internal"],
  "newlines-between": "never",
  pathGroups: [{ group: "external", pattern: "react", position: "before" }],
  pathGroupsExcludedImportTypes: ["react"],
};

const paddingLineBetweenStatementsOptions = [
  {
    blankLine: "always",
    next: ["block-like", "class", "export", "return", "multiline-const"],
    prev: ["*"],
  },
  {
    blankLine: "always",
    next: "*",
    prev: [
      "block-like",
      "import",
      "singleline-const",
      "singleline-let",
      "singleline-var",
    ],
  },
  {
    blankLine: "never",
    next: ["singleline-const", "singleline-let", "singleline-var"],
    prev: ["singleline-const", "singleline-let", "singleline-var"],
  },
  { blankLine: "never", next: "export", prev: "export" },
  { blankLine: "never", next: "import", prev: "import" },
];

const sortClassMembersOptions = {
  accessorPairPositioning: "getThenSet",
  order: [
    "constructor",
    "[static-properties]",
    "[conventional-private-properties]",
    "[properties]",
    "[static-methods]",
    "[methods]",
    "[conventional-private-methods]",
  ],
};

const jsxSortPropsOptions = {
  // noSortAlphabetically: true,
  callbacksLast: true,
  ignoreCase: false,
  reservedFirst: ["key", "ref"],
  shorthandLast: true,
};

// Rules
const rules = {
  "consistent-return": 1,
  "no-unused-vars": [1, { argsIgnorePattern: "^_", varsIgnorePattern: "^_" }],
  "import/order": [1, importOrderOptions],
  "lines-between-class-members": 1,
  "no-console": 1,
  "padding-line-between-statements": [
    1,
    ...paddingLineBetweenStatementsOptions,
  ],
  "prettier/prettier": 2,
  "react-hooks/rules-of-hooks": 2,
  "react-hooks/exhaustive-deps": 2,
  "react/button-has-type": 0,
  "react/destructuring-assignment": [2, "always", { ignoreClassFields: true }],
  "react/jsx-filename-extension": 0,
  "react/jsx-uses-react": 0,
  "react/jsx-props-no-spreading": 0,
  "react/jsx-sort-props": [1, jsxSortPropsOptions],
  "react/react-in-jsx-scope": 0,
  "react/self-closing-comp": [2, { html: false }],
  "react/prop-types": 0,
  "sort-class-members/sort-class-members": [1, sortClassMembersOptions],
  // "sort-keys-fix/sort-keys-fix": 1,
  // "space-before-function-paren": [1, "always"],
  "sort-vars": [1, { ignoreCase: false }],
  "@emotion/pkg-renaming": 1,
};

// Overrides
const overrides = [
  {
    extends: reactJSExtends,
    files: ["*.js", "*.jsx"],
    // parser: "@babel/eslint-parser",
    rules,
  },
];

// ESLINT Configs
const eslintConfig = {
  root: true,
  env: { browser: true, es6: true, jest: true, node: true },
  // overrides,
  extends: reactJSExtends,
  parser: "@babel/eslint-parser",
  rules,
  parserOptions: {
    ecmaFeatures: { jsx: true },
    ecmaVersion: 2020,
    sourceType: "module",
    babelOptions: {
      configFile: resolve(__dirname, "babel.config.js"),
    },
  },
  plugins: basePlugins,
  settings: {
    "import/resolver": {
      node: { extensions: [".js", ".jsx"] },
    },
    "import/parser": {
      espree: [".js", ".jsx"],
    },
    react: { version: "detect" },
  },
};

module.exports = eslintConfig;
