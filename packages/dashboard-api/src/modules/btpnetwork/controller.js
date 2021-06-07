'use strict';

const Boom = require('@hapi/boom');
const Joi = require('@hapi/joi');
const HttpStatus = require('@tiendq/http-status');
const model = require('./model');

async function getNetworkInfo(request, response) {
  const assets = await model.getAmountFeeAggregationSCORE();
  const allTimeAmount = await model.getTotalCumulativeAmountFeeAggregationSCORE();
  const totalNetworks = await model.getTotalNetworks();
  response.status(HttpStatus.OK).json({
    content: {
      volume: 1000, // TODO: total amount of tokens in FeeAggregationSCORE
      fee: {
        cumulativeAmount: 100000, // TODO: total tokens ever had in FeeAggregationSCORE
        currentAmount: 500, // TODO: total amount of tokens valid in FeeAggregationSCORE
        assets,
        allTimeAmount
      },
      totalNetworks,
    }
  });
}

module.exports = {
  getNetworkInfo,
};
