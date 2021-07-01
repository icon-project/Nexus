'use strict';

const IconService = require('icon-sdk-js');
const { countNetwork, sumTransactionAmount, countTransaction, getAllTimeFeeOfAssets, getVolumeMintedNetworks } = require('./repository');
const { getTotalBondedRelays } = require('../relays/repository');
const { getNetworkInfo } = require('../networks/repository');
const { logger, CURRENCIES } = require('../../common');
const { exchangeToFiat } = require('../../common/util');
const { HttpProvider, IconBuilder, IconConverter } = IconService;
const { getTokenVolumeAllTime } = require('../networks/repository');
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
      logger.debug(`getAmountFeeAggregationSCORE token: ${data.name}, address: ${data.address}`);
      let hexBalance = await getAvailableBalance(data.name);
      result.push({ name: data.name, value: Math.floor(IconConverter.toNumber(hexBalance) / ICX_NUMBER)});
    }

    return result;
  } catch (error) {
    logger.error('getAmountFeeAggregationSCORE failed', { error });
    throw error;
  }
}

// Get available of token registered in FAS by name of token
async function getAvailableBalance(tokenName) {
  const callBuilder = new IconBuilder.CallBuilder();
  const call = callBuilder
    .to(process.env.FEE_AGGREGATION_SCORE_ADDRESS)
    .method('availableBalance')
    .params({ _tokenName: tokenName })
    .build();

  try {
    const availableBalance = await iconService.call(call).execute();
    logger.debug(`getAvailableBalance tokeName: ${tokenName}, availableBalance: ${availableBalance}`);
    return availableBalance;
  } catch (error) {
    logger.error('getAvailableBalance failed', { error });
    throw error;
  }
}

async function getTotalNetworks() {
  try {
    return countNetwork();
  } catch (error) {
    logger.error('getTotalNetworks failed', { error });
    throw error;
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
  } catch (error) {
    logger.error('getTotalTransactionAmount failed', { error });
    throw error;
  }
}

async function getTotalTransaction() {
  try {
    return countTransaction();
  } catch (error) {
    logger.error('getTotalTransaction failed', { error });
    throw error;
  }
}

async function getBondedVolumeByRelays() {
  try {
    return getTotalBondedRelays();
  } catch (error) {
    logger.error('getBondedVolumeByRelays failed', { error });
    throw error;
  }
}

async function getAllTimeFee() {
  return await getAllTimeFeeOfAssets();
}

async function getMintedNetworks() {
  const mintedTokens = await getVolumeMintedNetworks();
  const networks = await getNetworkInfo();
  let results = [];
  let mapTokensVolume = new Map();
  
  for (let token of mintedTokens) {
    let fiat = await exchangeToFiat(token.tokenName, ['USD'], token.tokenVolume);
    let volume = fiat.USD;
    if (mapTokensVolume.has(token.networkId)) {
      volume += mapTokensVolume.get(token.networkId);
    }
    mapTokensVolume.set(token.networkId, volume);
  }
  
  for (let data of networks) {
    results.push({
      networkId: data.id,
      networkName: data.name,
      mintedVolume: mapTokensVolume.has(data.id)? mapTokensVolume.get(data.id) : 0
    });
  }
  
  return results;
}

async function getTokensPriceConversion(baseToken, amount, tokensToConvertTo) {
  let results = [];

  for(let data of tokensToConvertTo) {
    const price = await exchangeToFiat(baseToken, [data], amount);
    const tokenUpperCase = data.toUpperCase();
    results.push( {
      name: tokenUpperCase,
      value: price[`${tokenUpperCase}`].toFixed(2)
    });
  }

  return results;
}

module.exports = {
  getAmountFeeAggregationSCORE,
  getTotalNetworks,
  getTotalTransactionAmount,
  getTotalTransaction,
  getBondedVolumeByRelays,
  getAllTimeFee,
  getMintedNetworks,
  getTokensPriceConversion
};
