const fs = require('fs');
const path = require('path');

const srcPath = '../../../src';
const pageComponents = fs.readdirSync(path.join(__dirname, `${srcPath}/components`));
const pageContainers = fs.readdirSync(path.join(__dirname, `${srcPath}/containers`));
const components = pageComponents.concat(pageContainers);

function componentExists(comp) {
  return components.map((c) => c.toLowerCase()).indexOf(comp.toLowerCase()) >= 0;
}

module.exports = componentExists;
