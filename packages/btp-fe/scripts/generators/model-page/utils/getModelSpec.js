const modelSpec = require('../model-spec.json');

module.exports = function getModelSpec(model) {
  return modelSpec.find((m) => m.collectionName === model);
};
