'use strict';

const IconService = require('icon-sdk-js');
const {
  countNetwork,
  countTransaction,
  getAllTimeFeeOfAssets,
  getVolumeMintedNetworks,
  getLatestTokensMinted,
  getTotalTokensMintedLast24h,
  getTotalBondedIcx,
  getAllIndexerStats
} = require('./repository');

const { getNetworkInfo } = require('../networks/repository');
const {
  logger,
  CURRENCIES,
  hexToFixedAmount,
  hexToIcxUnit,
  tokenToUsd,
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
        promises.push(tokenToUsd(data.name, amount));
      }
    }

    let totalAssets = await Promise.all(promises);
    let totalUSD = 0;

    totalAssets.forEach((item) => (totalUSD += item));

    return {
      assets,
      totalUSD: Number(totalUSD.toFixed(2)),
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
  let totalVolume24hAgo = await getTotalTransactionAmount(true);
  return +(((totalVolume - totalVolume24hAgo) / totalVolume) * 100).toFixed(2);
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
      promises.push(tokenToUsd(item.tokenName, Number(item.totalVolume)));
    }

    const results = await Promise.all(promises);
    results.forEach((item) => (totalUSD += item));

    return totalUSD;
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

async function getBondedVolumeByRelayCandidates() {
  try {
    return await getTotalBondedIcx();
  } catch (error) {
    logger.error('getBondedVolumeByRelayCandidates failed', { error });
    throw error;
  }
}

async function getAllTimeFee() {
  let totalUSD = 0;
  let promises = [];
  const assets = await getAllTimeFeeOfAssets();

  for (let item of assets) {
    if (0 !== item.value) {
      promises.push(tokenToUsd(item.name, item.value));
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
    let volume = await tokenToUsd(token.tokenName, token.tokenVolume);

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

async function getPercentsMintVolumeLast24h() {
  const tokensCurrently = await getLatestTokensMinted();
  const tokensLast24h = await getTotalTokensMintedLast24h();

  // in the first 23 hours
  if (0 === tokensLast24h) return 0;

  if (tokensCurrently && tokensLast24h) {
    try {
      const totalUSD = await totalTokensToUSD(tokensCurrently);
      const last24hUSD = await totalTokensToUSD(tokensLast24h);

      let percentage = (totalUSD - last24hUSD) / last24hUSD;

      return Number((percentage * 100).toFixed(2));
    } catch (error) {
      logger.error('Fails to convert tokens to usd', { error });
      return 0;
    }
  }
  return 0;
}

async function totalTokensToUSD(tokens) {
  let promises = [];
  let totalUSD = 0;

  for (let item of tokens) {
    promises.push(tokenToUsd(item.tokenName, item.tokenAmount));
  }

  let totalAssets = await Promise.all(promises);

  totalAssets.forEach((item) => {
    totalUSD += item['USD'] ? item['USD'] : 0;
  });

  return totalUSD;
}

async function getIndexerStats() {
  return await getAllIndexerStats();
}

module.exports = {
  getAmountFeeAggregationSCORE,
  getTotalNetworks,
  getTotalTransactionAmount,
  getTotalTransaction,
  getBondedVolumeByRelayCandidates,
  getAllTimeFee,
  getMintedNetworks,
  calculateVolumePercents,
  getPercentsMintVolumeLast24h,
  getIndexerStats
};
