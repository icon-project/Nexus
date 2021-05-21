'use strict';

const Boom = require('@hapi/boom');
const Joi = require('@hapi/joi');
const HttpStatus = require('@tiendq/http-status');
const model = require('./model');

async function getNetworkInfo(request, response) {
  const assets = await model.getAmountFeeAggregationSCORE();
  response.status(HttpStatus.OK).json({
    content: {
      volume: 1000,
      fee: {
        cumulativeAmount: 100000,
        currentAmount: 500,
        assets
      }
    }
  });
}

module.exports = {
  getNetworkInfo
};
