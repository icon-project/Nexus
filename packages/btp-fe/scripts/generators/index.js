const path = require('path');
const { execSync } = require('child_process');
const modelPageGenerator = require('./model-page/index.js');
const componentGenerator = require('./component/index.js');
const containerGenerator = require('./container/index.js');
const srcPath = '/../../src';

module.exports = (plop) => {
  plop.addHelper('curly', (object, open) => (open ? '{' : '}'));
  plop.setActionType('prettify', (answers, config) => {
    const folderPath = `${path.join(
      __dirname,
      srcPath,
      config.path,
      plop.getHelper('properCase')(answers.name),
      '**',
      '**.{js,jsx}',
    )}`;
    const routesPath = `${path.join(__dirname, srcPath, 'Routes.jsx')}`;
    const utilsPath = `${path.join(__dirname, `${srcPath}/utils/`, '*.js')}`;

    try {
      execSync(`yarn prettify --check "${folderPath}" "${routesPath}" "${utilsPath}"`);
      return folderPath;
    } catch (err) {
      console.error('Error while prettifying:', err);
      throw err;
    }
  });

  plop.setGenerator('modelPage', modelPageGenerator);
  plop.setGenerator('component', componentGenerator);
  plop.setGenerator('container', containerGenerator);
  plop.setGenerator('testGenerator', require('./utils/testGenerator'));
};
