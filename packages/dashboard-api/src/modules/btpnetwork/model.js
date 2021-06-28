'use strict';

const IconService = require('icon-sdk-js');
const { logger, CURRENCIES } = require('../../common');
const { exchangeToFiat } = require('../../common/util');
const { countNetwork, countTransaction, getAllTimeFeeOfAssets } = require('./repository');
const { getTotalBondedRelays } = require('../relays/repository');
const { getTokenVolumeAllTime } = require('../networks/repository');

const { HttpProvider } = IconService;
const { IconBuilder } = IconService;

const provider = new HttpProvider(process.env.ICON_API_URL);
const iconService = new IconService(provider);

async function getAmountFeeAggregationSCORE() {
  const { CallBuilder } = IconBuilder;
  const callBuilder = new CallBuilder();
  let result = [];

  try {
    const call = callBuilder.to(process.env.FEE_AGGREGATION_SCORE_ADDRESS).method('tokens').build();
    const tokens = await iconService.call(call).execute();

    for (let data of tokens) {
      logger.debug(`[getAmountFeeAggregationSCORE] token: ${data.name}, address: ${data.address}`);
      let hexBalance = await getAvailableBalance(data.name);
      let dexBalance = parseInt(hexBalance.toString(16), 16);
      result.push({ name: data.name, value: dexBalance });
    }

    return result;
  } catch (err) {
    logger.error('getAmountFeeAggregationSCORE() failed when execute get list tokens', err);
    throw new Error('"getAmountFeeAggregationSCORE" job failed: ' + err.message);
  }
}

async function getAvailableBalance(nameToken) {
  const { CallBuilder } = IconBuilder;
  const callBuilder = new CallBuilder();
  const call = callBuilder
    .to(process.env.FEE_AGGREGATION_SCORE_ADDRESS)
    .method('availableBalance')
    .params({ _tokenName: nameToken })
    .build();

  try {
    const availableBalance = await iconService.call(call).execute();
    logger.debug(`[getAvailableBalance] availableBalance: ${availableBalance}`);
    return availableBalance;
  } catch (err) {
    logger.error('getAvailableBalance() failed when execute get balance FAS', err);
    throw new Error('"getAvailableBalance" job failed: ' + err.message);
  }
}

async function getTotalNetworks() {
  try {
    return countNetwork();
  } catch (err) {
    logger.error(err, '"getTotalNetworks" failed while getting total networks');
    throw new Error('"getTotalNetworks" job failed: ' + err.message);
  }
}

async function getTotalTransactionAmount() {
  try {
    let tokenTransAmount = await getTokenVolumeAllTime();
    let totalUSD = 0;
    let promises = [];
    for (let item of tokenTransAmount) {
      promises.push(exchangeToFiat(item.tokenName, [CURRENCIES.USD], parseInt(item.tokenVolume)));
    }
    const results = await Promise.all(promises);
    results.forEach((item) => (totalUSD += item[CURRENCIES.USD]));
    return totalUSD || 0;
  } catch (err) {
    logger.error('"getTotalTransactionAmount" failed while getting total transaction amount', err);
    throw new Error('"getTotalTransactionAmount" job failed: ' + err.message);
  }
}

async function getTotalTransaction() {
  try {
    return countTransaction();
  } catch (err) {
    logger.error('"getTotalTransaction" failed while getting total transaction', err);
    throw new Error('"getTotalTransaction" job failed: ' + err.message);
  }
}

async function getBondedVolumeByRelays() {
  try {
    return getTotalBondedRelays();
  } catch (err) {
    logger.error('"getBondedVolumeByRelays" failed while getting total volume by Relays', err);
    throw new Error('"getBondedVolumeByRelays" job failed: ' + err.message);
  }
}

async function getAllTimeFee() {
  return await getAllTimeFeeOfAssets();
}

module.exports = {
  getAmountFeeAggregationSCORE,
  getTotalNetworks,
  getTotalTransactionAmount,
  getTotalTransaction,
  getBondedVolumeByRelays,
  getAllTimeFee,
};
