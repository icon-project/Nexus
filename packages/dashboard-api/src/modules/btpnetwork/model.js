'use strict';

const IconService = require('icon-sdk-js');
const {
  countNetwork,
  countTransaction,
  getAllTimeFeeOfAssets,
  getVolumeMintedNetworks,
  getTotalUSDMinted,
  getTotalUSDMintedLast24h,
} = require('./repository');
const { getTotalBondedRelays } = require('../relays/repository');
const { getNetworkInfo } = require('../networks/repository');
const {
  logger,
  CURRENCIES,
  hexToFixedAmount,
  hexToIcxUnit,
  exchangeToFiat,
  numberToFixedAmount,
} = require('../../common');

const { HttpProvider, IconBuilder } = IconService;
const { getTotalTransactionVolume } = require('../transactions/repository');

const provider = new HttpProvider(process.env.ICON_API_URL);
const iconService = new IconService(provider);

// Get list tokens registered in FAS and show amount of each token
async function getAmountFeeAggregationSCORE() {
  const callBuilder = new IconBuilder.CallBuilder();

  try {
    const call = callBuilder.to(process.env.FEE_AGGREGATION_SCORE_ADDRESS).method('tokens').build();
    const tokens = await iconService.call(call).execute();

    let assets = [];
    let promises = [];

    for (let data of tokens) {
      let hexBalance = await getAvailableBalance(data.name);

      logger.debug(`Token: ${data.name}, balance: ${hexBalance}`);
      assets.push({ name: data.name, value: hexToFixedAmount(hexBalance) });

      if ('0x0' !== hexBalance) {
        const amount = hexToIcxUnit(hexBalance);
        promises.push(exchangeToFiat(data.name, ['USD'], amount));
      }
    }

    let totalAssets = await Promise.all(promises);
    let totalUSD = 0;

    totalAssets.forEach(item => {
      totalUSD += item['USD'] ? item['USD'] : 0;
    });

    return {
      assets,
      totalUSD: Number(totalUSD.toFixed(2))
    };
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
    logger.debug(
      `getAvailableBalance tokeName: ${tokenName}, availableBalance: ${availableBalance}`,
    );
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

async function calculateVolumePercents() {
  let totalVolume = await getTotalTransactionAmount(false);
  let totalVolume24hAgo = (await getTotalTransactionAmount(true)) || 1;
  return +((totalVolume * 100) / totalVolume24hAgo).toFixed(2);
}

async function getTotalTransactionAmount(is24hAgo) {
  try {
    let tokenTransAmount = [];
    let totalUSD = 0;
    let promises = [];

    if (is24hAgo) {
      tokenTransAmount = await getTotalTransactionVolume(true, 'ASC');
    } else {
      tokenTransAmount = await getTotalTransactionVolume(false, 'DESC');
    }

    for (let item of tokenTransAmount) {
      promises.push(exchangeToFiat(item.tokenName, [CURRENCIES.USD], Number(item.totalVolume)));
    }
    const results = await Promise.all(promises);
    results.forEach((item) => (totalUSD += item[CURRENCIES.USD] ? item[CURRENCIES.USD] : 0));
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
  let totalUSD = 0;
  let promises = [];
  const assets = await getAllTimeFeeOfAssets();

  for (let item of assets) {
    if (0 !== item.value) {
      promises.push(exchangeToFiat(item.name, ['USD'], item.value));
    }
  }

  let totalAssets = await Promise.all(promises);
  totalAssets.forEach((item) => {
    totalUSD += item['USD'] ? item['USD'] : 0;
  });
  totalUSD = numberToFixedAmount(totalUSD);

  let feeAssets = assets.map((item) => ({
    name: item.name,
    value: numberToFixedAmount(item.value),
  }));

  return {
    feeAssets,
    totalUSD,
  };
}

async function getMintedNetworks() {
  const mintedTokens = await getVolumeMintedNetworks();
  const networks = await getNetworkInfo();
  let results = [];
  let mapTokensVolume = new Map();

  for (let token of mintedTokens) {
    let fiat = await exchangeToFiat(token.tokenName, ['USD'], token.tokenVolume);
    let volume = fiat.USD ? fiat.USD : 0;
    if (mapTokensVolume.has(token.networkId)) {
      volume += mapTokensVolume.get(token.networkId);
    }
    mapTokensVolume.set(token.networkId, volume);
  }

  for (let data of networks) {
    results.push({
      networkId: data.id,
      networkName: data.name,
      mintedVolume: mapTokensVolume.has(data.id)
        ? numberToFixedAmount(mapTokensVolume.get(data.id))
        : 0,
    });
  }

  return results;
}

async function getTokensPriceConversion(baseToken, amount, tokensToConvertTo) {
  let results = [];

  for (let data of tokensToConvertTo) {
    const price = await exchangeToFiat(baseToken, [data], amount);
    const tokenUpperCase = data.toUpperCase();

    results.push({
      name: tokenUpperCase,
      value: price[`${tokenUpperCase}`] ? Number(price[`${tokenUpperCase}`].toFixed(2)) : 0,
    });
  }

  return results;
}

async function getPercentsMintVolumeLast24h() {
  const totalVolumeMintedCurrently = await getTotalUSDMinted();
  const totalVolumeMintedLast24h = await getTotalUSDMintedLast24h();

  if (totalVolumeMintedCurrently && totalVolumeMintedCurrently) {
    let percentage = (((totalVolumeMintedCurrently - totalVolumeMintedLast24h) / totalVolumeMintedLast24h));
    return Number((percentage * 100).toFixed(2));
  }

  return 0;
}

module.exports = {
  getAmountFeeAggregationSCORE,
  getTotalNetworks,
  getTotalTransactionAmount,
  getTotalTransaction,
  getBondedVolumeByRelays,
  getAllTimeFee,
  getMintedNetworks,
  getTokensPriceConversion,
  calculateVolumePercents,
  getPercentsMintVolumeLast24h
};
