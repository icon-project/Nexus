'use strict';

const _ = require('lodash');
module.exports = {
  authentication: (req, res, next) => {
    const key = _.get(req, 'query.apiKey', null);
    if (key === process.env.SLACK_COMMAND_API_KEY) {
      next();
    } else {
      res.status(401).send();
    }
  }
};
