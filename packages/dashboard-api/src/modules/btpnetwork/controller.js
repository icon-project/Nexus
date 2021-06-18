'use strict';

const Boom = require('@hapi/boom');
const Joi = require('@hapi/joi');
const HttpStatus = require('@tiendq/http-status');

const model = require('./model');

async function getNetworkInfo(request, response) {
  const assets = await model.getAmountFeeAggregationSCORE();
  const totalNetworks = await model.getTotalNetworks();
  const totalTransactionAmount = await model.getTotalTransactionAmount();
  const totalTransactions = await model.getTotalTransaction();
  response.status(HttpStatus.OK).json({
    content: {
      volume: totalTransactionAmount,
      fee: {
        cumulativeAmount: 100000, // TODO: total tokens ever had in FeeAggregationSCORE
        currentAmount: 500, // TODO: total amount of tokens valid in FeeAggregationSCORE
        assets,
      },
      totalNetworks,
      totalTransactions,
    },
  });
}

module.exports = {
  getNetworkInfo,
};
