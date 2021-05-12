/**
 * Container Generator
 */

const componentExists = require('../utils/componentExists');
const srcPath = '../../src';

module.exports = {
  description: 'Generate a component',
  prompts: [
    {
      type: 'input',
      name: 'name',
      message: 'What is component name?',
      default: 'C',
      validate: (value) => {
        if (/.+/.test(value)) {
          return componentExists(value) ? 'A component with this name has already existed' : true;
        }

        return 'The name is required';
      },
    },
    {
      type: 'confirm',
      name: 'memo',
      default: false,
      message: 'Do you want to wrap your component in React.memo?',
    },
    {
      type: 'confirm',
      name: 'wantTranslate',
      default: true,
      message: 'Do you want to add translate multiple language to the container?',
    },
    {
      type: 'confirm',
      name: 'wantLoadable',
      default: false,
      message: 'Do you want to load the component asynchronously?',
    },
  ],
  actions: () => {
    // Generate index.js and index.test.js
    const actions = [
      {
        type: 'add',
        path: `${srcPath}/components/{{properCase name}}/index.js`,
        templateFile: './utils/index.js.hbs',
        abortOnFail: true,
      },
      {
        type: 'add',
        path: `${srcPath}/components/{{properCase name}}/{{properCase name}}.jsx`,
        templateFile: './component/component.js.hbs',
        abortOnFail: true,
      },
      {
        type: 'add',
        path: `${srcPath}/components/{{properCase name}}/{{properCase name}}.stories.jsx`,
        templateFile: './component/component.stories.js.hbs',
        abortOnFail: true,
      },
    ];

    actions.push({
      type: 'prettify',
      path: '/components/',
    });

    return actions;
  },
};
