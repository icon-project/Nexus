const componentExists = require('./componentExists');

module.exports = {
  NAME: {
    type: 'input',
    name: 'name',
    message: 'What should it be called?',
    default: 'Form',
    validate: (value) => {
      if (/.+/.test(value)) {
        return componentExists(value)
          ? 'A component or container with this name already exists'
          : true;
      }

      return 'The name is required';
    },
  },
  MODEL_SPEC: {
    type: 'input',
    name: 'model',
    message: 'What is model spec?',
    default: 'friends',
    validate: (value) => {
      if (/.+/.test(value)) {
        return true;
      }

      return 'The model spec is required';
    },
  },
  LOADABLE: {
    type: 'confirm',
    name: 'wantLoadable',
    default: true,
    message: 'Do you want to load resources asynchronously?',
  },
  MODEL_STORE: {
    type: 'confirm',
    name: 'wantModel',
    default: true,
    message: 'Should it have model store?',
  },
  MULTILANGUAGE: {
    type: 'confirm',
    name: 'wantTranslate',
    default: true,
    message: 'Do you want to add translate multiple language to the container?',
  },
  LAYOUT: {
    type: 'confirm',
    name: 'isLayoutPage',
    default: true,
    message: 'Do you want to add layout component to container?',
  },
};
