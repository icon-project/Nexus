const path = require('path');

module.exports = {
  webpackFinal: (config) => {
    // https://github.com/storybookjs/storybook/issues/2704#issuecomment-357407742
    config.resolve.modules = ["node_modules", path.resolve(__dirname, "../src")];
    return { ...config };
  },
  "stories": [
    "../src/**/*.stories.mdx",
    "../src/**/*.stories.@(js|jsx|ts|tsx)"
  ],
  "addons": [
    "@storybook/addon-essentials",
    "@storybook/addon-links",
  ]
}