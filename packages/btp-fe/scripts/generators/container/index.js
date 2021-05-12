const prompts = require('../utils/prompts');
const buildBasePath = require('../utils/buildBasePath');
const srcPath = '../../src';

module.exports = {
  description: 'Create new container',
  prompts: [prompts.NAME, prompts.LOADABLE, prompts.MODEL_STORE, prompts.MULTILANGUAGE],
  actions: (data) => {
    const buildPath = buildBasePath(`${srcPath}/containers/{{properCase name}}`);

    const actions = [
      {
        type: 'add',
        path: buildPath(`/index.js`),
        templateFile: './utils/index.js.hbs',
        abortOnFail: true,
      },
      {
        type: 'add',
        path: buildPath(`/{{properCase name}}.jsx`),
        templateFile: './container/container.js.hbs',
        abortOnFail: true,
      },
    ];

    if (data.wantModel) {
      actions.push({
        type: 'add',
        path: buildPath(`/{{camelCase name}}Model.js`),
        templateFile: './container/model.js.hbs',
        abortOnFail: true,
      });
      actions.push({
        type: 'add',
        path: buildPath(`/__tests__/{{camelCase name}}Model.test.js`),
        templateFile: './container/model.test.js.hbs',
        abortOnFail: true,
      });
    }

    actions.push({
      type: 'prettify',
      path: '/containers/',
    });

    return actions;
  },
};
