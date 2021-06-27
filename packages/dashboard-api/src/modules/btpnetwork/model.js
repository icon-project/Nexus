'use strict';

const { logger } = require('../../common');
const IconService = require('icon-sdk-js');
const { countNetwork, sumTransactionAmount, countTransaction, getAllTimeFeeOfAssets } = require('./repository');
const { getTotalBondedRelays } = require('../relays/repository');
const { HttpProvider, IconBuilder, IconConverter } = IconService;
const provider = new HttpProvider(process.env.ICON_API_URL);
const iconService = new IconService(provider);
const ICX_NUMBER = 10 ** 18;

// Get list tokens registered in FAS and show amount of each token
async function getAmountFeeAggregationSCORE() {
  const callBuilder = new IconBuilder.CallBuilder();
  let result = [];

  try {
    const call = callBuilder.to(process.env.FEE_AGGREGATION_SCORE_ADDRESS).method('tokens').build();
    const tokens = await iconService.call(call).execute();

    for (let data of tokens) {
      logger.debug(`token: ${data.name}, address: ${data.address}`);
      let hexBalance = await getAvailableBalance(data.name);
      result.push({ name: data.name, value: Math.floor(IconConverter.toNumber(hexBalance) / ICX_NUMBER)});
    }

    return result;
  } catch (e) {
    logger.error('getAmountFeeAggregationSCORE failed', { error });
    throw error;
  }
}

// Get available of token registered in FAS by name of token
async function getAvailableBalance(nameToken) {
  const callBuilder = new IconBuilder.CallBuilder();
  const call = callBuilder
    .to(process.env.FEE_AGGREGATION_SCORE_ADDRESS)
    .method('availableBalance')
    .params({ _tokenName: nameToken })
    .build();

  try {
    const availableBalance = await iconService.call(call).execute();
    logger.debug(`tokeName: ${nameToken}, availableBalance: ${availableBalance}`);
    return availableBalance;
  } catch (e) {
    logger.error('getAvailableBalance failed', { error });
    throw error;
  }
}

async function getTotalNetworks() {
  try {
    return countNetwork();
  } catch (err) {
    logger.error('getTotalNetworks failed', { error });
    throw error;
  }
}

async function getTotalTransactionAmount() {
  try {
    return sumTransactionAmount();
  } catch (err) {
    logger.error('getTotalTransactionAmount failed', { error });
    throw error;
  }
}

async function getTotalTransaction() {
  try {
    return countTransaction();
  } catch (err) {
    logger.error('getTotalTransaction failed', { error });
    throw error;
  }
}

async function getBondedVolumeByRelays() {
  try {
    return getTotalBondedRelays();
  } catch (err) {
    logger.error('getBondedVolumeByRelays failed', { error });
    throw error;
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
  getAllTimeFee
};
