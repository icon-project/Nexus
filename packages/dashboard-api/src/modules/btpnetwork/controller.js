'use strict';

const HttpStatus = require('@tiendq/http-status');
const model = require('./model');

// curl http://localhost:8000/v1/btpnetwork | jq
async function getNetworkInfo(request, response) {
  const currentFeeAssets = await model.getAmountFeeAggregationSCORE();
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
        cumulativeAmount: allTimeFeeAssets.totalUSD,
        currentAmount: currentFeeAssets.totalUSD,
        assert: currentFeeAssets.assets,
        allTimeAmount: allTimeFeeAssets.feeAssets
      },
      totalNetworks,
      totalTransactions,
      minted: mintedNetworks
    }
  });
}

async function getPriceConversion(request, response) {
  if (!request.query.token || !request.query.amount || !request.query.convert_to) {
    return response.sendStatus(HttpStatus.BadRequest);
  }

  const baseToken = request.query.token;
  const amount = parseInt(request.query.amount);
  const tokensToConvertTo = request.query.convert_to.split(',');

  const priceTokens = await model.getTokensPriceConversion(baseToken, amount, tokensToConvertTo);

  response.status(HttpStatus.OK).json({
    content: priceTokens,
  });
}

module.exports = {
  getNetworkInfo,
  getPriceConversion
};
