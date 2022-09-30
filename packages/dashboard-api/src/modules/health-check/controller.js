'use strict';

const _ = require('lodash');
const { indexerCommandHealthCheck } = require('./model');

module.exports = {
  healthCheck: async (req, res) => {
    const message = await indexerCommandHealthCheck();
    if (message) {
      res.send(message);
    } else {
      res.status(404).send();
    }
  }
};
