'use strict';

const { logger } = require('../../common');
const IconService = require('icon-sdk-js');
const { countNetwork, sumTransactionAmount, countTransaction, getAllTimeFeeOfAssets, getVolumeMintedNetworks } = require('./repository');
const { getTotalBondedRelays } = require('../relays/repository');
const { exchangeToFiat } = require('../../common/util');
const { getNetworkInfo } = require('../networks/repository');

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

async function getBondedVolumeByRelays() {
  try {
    return getTotalBondedRelays();
  } catch (err) {
    logger.error(err, '"getBondedVolumeByRelays" failed while getting total volume by Relays');
    throw new Error('"getBondedVolumeByRelays" job failed: ' + err.message);
  }
}

async function getAllTimeFee() {
  return await getAllTimeFeeOfAssets();
}

async function getMintedNetworks() {
  const mintedTokens = await getVolumeMintedNetworks();
  const networks = await getNetworkInfo();
  let result = [];
  let mapTokensVolume = new Map();
  for( let token of mintedTokens) {
    let fiat = await exchangeToFiat(token.tokenName, ['USD'], token.tokenVolume);
    let volume = fiat.USD;
    if(mapTokensVolume.has(token.networkId)) {
      volume += mapTokensVolume.get(token.networkId);
    }
    mapTokensVolume.set(token.networkId, volume);
  }
  for( let data of networks ) {
    result.push({
      networkId: data.id,
      mintedVolume: mapTokensVolume.has(data.id)? mapTokensVolume.get(data.id) : 0
    })
  }
  return result;
}

module.exports = {
  getAmountFeeAggregationSCORE,
  getTotalNetworks,
  getTotalTransactionAmount,
  getTotalTransaction,
  getBondedVolumeByRelays,
  getAllTimeFee,
  getMintedNetworks
};
