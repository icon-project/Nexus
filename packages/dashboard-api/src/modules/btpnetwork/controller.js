'use strict';

const HttpStatus = require('@tiendq/http-status');
const model = require('./model');
const { tokenToUsd, numberToFixedAmount } = require('../../common');

// curl http://localhost:8000/v1/btpnetwork | jq
// curl http://localhost:8000/v1/btpnetwork?stats=1 | jq
async function getNetworkInfo(request, response) {
  let volumeLast24hChange;

  if ('true' === request.query.volumeLast24h) {
    volumeLast24hChange = await model.calculateVolumePercents();
  }

  let mintVolumeLast24hChange;
  if (request.query.mintLast24h === 'true') {
    mintVolumeLast24hChange = await model.getPercentsMintVolumeLast24h();
  }

  let stats;

  if (request.query.stats) {
    stats = {
      indexers: [...await model.getIndexerStats()]
    };
  }

  const currentFeeAssets = await model.getAmountFeeAggregationSCORE();
  const totalNetworks = await model.getTotalNetworks();
  const totalTransactionAmount = await model.getTotalTransactionAmount();
  const totalTransactions = await model.getTotalTransaction();
  const bondedRelays = await model.getBondedVolumeByRelayCandidates();
  const allTimeFeeAssets = await model.getAllTimeFee();
  const mintedNetworks = await model.getMintedNetworks();

  response.status(HttpStatus.OK).json({
    content: {
      volume: totalTransactionAmount,
      volumeLast24hChange,
      bondedValue: numberToFixedAmount(bondedRelays),
      fee: {
        cumulativeAmount: allTimeFeeAssets.totalUSD,
        currentAmount: currentFeeAssets.totalUSD,
        assets: currentFeeAssets.assets,
        allTimeAmount: allTimeFeeAssets.feeAssets,
      },
      totalNetworks,
      totalTransactions,
      minted: mintedNetworks,
      mintVolumeLast24hChange,
      stats
    },
  });
}

// curl http://localhost:8000/v1/btpnetwork/converter?token=btc&amount=100&convert_to=usd | jq
async function getPriceConversion(request, response) {
  if (!request.query.token || !request.query.amount || !request.query.convert_to)
    return response.sendStatus(HttpStatus.BadRequest);

  if (Number.isNaN(Number(request.query.amount)))
    return response.sendStatus(HttpStatus.BadRequest);

  response.status(HttpStatus.OK).json({
    content: [{
      name: 'USD',
      value: await tokenToUsd(request.query.token, Number(request.query.amount)),
    }]
  });
}

module.exports = {
  getNetworkInfo,
  getPriceConversion,
};
