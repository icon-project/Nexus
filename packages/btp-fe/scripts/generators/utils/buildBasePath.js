const path = require('path');

module.exports = function buildBasePath(basePath) {
  return (pathName) => path.join(basePath, pathName);
};
