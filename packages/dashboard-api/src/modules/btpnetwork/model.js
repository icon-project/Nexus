'use strict';

const { logger } = require('../../common');
const IconService = require('icon-sdk-js');
const { countNetwork, sumTransactionAmount, countTransaction, getNetworkInfo} = require('./repository');
const { HttpProvider } = IconService;
const { IconBuilder } = IconService;
const provider = new HttpProvider(process.env.NODE_URL);
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
  } catch (e) {
    logger.error(e, 'getAmountFeeAggregationSCORE() failed when execute get list tokens');
    throw new Error('"getAmountFeeAggregationSCORE" job failed: ' + e.message);
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
  } catch (e) {
    logger.error(e, 'getAvailableBalance() failed when execute get balance FAS');
    throw new Error('"getAvailableBalance" job failed: ' + e.message);
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
    return sumTransactionAmount();
  } catch (err) {
    logger.error(err, '"getTotalTransactionAmount" failed while getting total transaction amount');
    throw new Error('"getTotalTransactionAmount" job failed: ' + err.message);
  }
}

async function getTotalTransaction() {
  try {
    return countTransaction();
  } catch (err) {
    logger.error(err, '"getTotalTransaction" failed while getting total transaction');
    throw new Error('"getTotalTransaction" job failed: ' + err.message);
  }
}

module.exports = {
  getAmountFeeAggregationSCORE,
  getTotalNetworks,
  getTotalTransactionAmount,
  getTotalTransaction,
};
