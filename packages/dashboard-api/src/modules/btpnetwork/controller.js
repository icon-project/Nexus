'use strict';

const HttpStatus = require('@tiendq/http-status');
const model = require('./model');

// curl http://localhost:8000/v1/btpnetwork | jq
async function getNetworkInfo(request, response) {
  let last24hChange;
  if (request.query.availableAmountLast24h == 1) {
    last24hChange = await model.calculateVolumePercents();
  }

  let mintVolumeLast24hChange;
  if (request.query.mintLast24h === 'true') {
    mintVolumeLast24hChange = await model.getPercentsMintVolumeLast24h();
  }

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
      last24hChange,
      bondedValue: bondedRelays,
      fee: {
        cumulativeAmount: allTimeFeeAssets.totalUSD,
        currentAmount: currentFeeAssets.totalUSD,
        assets: currentFeeAssets.assets,
        allTimeAmount: allTimeFeeAssets.feeAssets,
      },
      totalNetworks,
      totalTransactions,
      minted: mintedNetworks,
      mintVolumeLast24hChange
    },
  });
}

// curl http://localhost:8000/v1/btpnetwork/converter?token=btc&amount=100&convert_to=usd | jq
async function getPriceConversion(request, response) {
  if (!request.query.token || !request.query.amount || !request.query.convert_to) {
    return response.sendStatus(HttpStatus.BadRequest);
  }

  const baseToken = request.query.token;
  const amount = parseFloat(request.query.amount);
  const tokensToConvertTo = request.query.convert_to.split(',');
  const priceTokens = await model.getTokensPriceConversion(baseToken, amount, tokensToConvertTo);

  response.status(HttpStatus.OK).json({
    content: priceTokens,
  });
}

module.exports = {
  getNetworkInfo,
  getPriceConversion,
};
