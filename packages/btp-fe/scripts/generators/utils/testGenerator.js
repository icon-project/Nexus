const transformEslint = require('./transform-eslint');

module.exports = {
  description: 'Test generator',
  prompts: [],
  actions: [
    {
      type: 'add',
      path: `../../scripts/generators/utils/test-ignored.js`,
      template: `module.exports = { hello:
        "this is test template" };
        `,
      skipIfExists: true,
      transform: transformEslint,
      force: true,
    },
  ],
};
