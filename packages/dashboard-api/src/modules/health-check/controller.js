'use strict';

const _ = require('lodash');
const { indexerCommandHealthCheck } = require('./model');

module.exports = {
  healthCheck: async (req, res) => {
    const indexerName = _.get(req, 'query.indexer', '');
    const message = await indexerCommandHealthCheck(indexerName);
    if (message) {
      res.send(message);
    } else {
      res.status(404).send();
    }
  }
};
