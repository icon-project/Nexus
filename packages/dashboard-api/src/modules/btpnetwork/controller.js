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
  const bondedRelays = await model.getBondedVolumeByRelays();
  const allTimeFeeAssets = await model.getAllTimeFee();
  const mintedNetworks = await model.getMintedNetworks();

  response.status(HttpStatus.OK).json({
    content: {
      volume: totalTransactionAmount,
      bondedValue: bondedRelays,
      fee: {
        cumulativeAmount: 100000, // TODO: total tokens ever had in FeeAggregationSCORE
        currentAmount: 500, // TODO: total amount of tokens valid in FeeAggregationSCORE
        assets,
        allTimeAmount: allTimeFeeAssets
      },
      totalNetworks,
      totalTransactions,
      minted: mintedNetworks
    }
  });
}

async function getPriceConversion(request, response) {
  if (!request.query.token || !request.query.amount || !request.query.tokens_convert_to) {
    return response.sendStatus(HttpStatus.BadRequest);
  }

  const baseToken = request.query.token;
  const amount = parseInt(request.query.amount);
  const tokensToConvertTo = request.query.tokens_convert_to.split(',');
  
  const priceTokens = await model.getTokensPriceConversion(baseToken, amount, tokensToConvertTo);
  
  response.status(HttpStatus.OK).json({
    content:  priceTokens,
  });
}

module.exports = {
  getNetworkInfo,
  getPriceConversion
};
