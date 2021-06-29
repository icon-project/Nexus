'use strict';

const IconService = require('icon-sdk-js');
const { logger, CURRENCIES } = require('../../common');
const { exchangeToFiat } = require('../../common/util');
const { countNetwork, countTransaction, getAllTimeFeeOfAssets } = require('./repository');
const { getTotalBondedRelays } = require('../relays/repository');
<<<<<<< HEAD
const { HttpProvider, IconBuilder, IconConverter } = IconService;
=======
const { getTokenVolumeAllTime } = require('../networks/repository');

const { HttpProvider } = IconService;
const { IconBuilder } = IconService;

>>>>>>> 9f52603bc2b700a597af07535985673d1672e428
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
<<<<<<< HEAD
  } catch (e) {
    logger.error('getAmountFeeAggregationSCORE failed', { error });
    throw error;
=======
  } catch (err) {
    logger.error('getAmountFeeAggregationSCORE() failed when execute get list tokens', err);
    throw new Error('"getAmountFeeAggregationSCORE" job failed: ' + err.message);
>>>>>>> 9f52603bc2b700a597af07535985673d1672e428
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
    logger.debug(`getAvailableBalance tokeName: ${nameToken}, availableBalance: ${availableBalance}`);
    return availableBalance;
<<<<<<< HEAD
  } catch (e) {
    logger.error('getAvailableBalance failed', { error });
    throw error;
=======
  } catch (err) {
    logger.error('getAvailableBalance() failed when execute get balance FAS', err);
    throw new Error('"getAvailableBalance" job failed: ' + err.message);
>>>>>>> 9f52603bc2b700a597af07535985673d1672e428
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
<<<<<<< HEAD
    logger.error('getTotalTransactionAmount failed', { error });
    throw error;
=======
    logger.error('"getTotalTransactionAmount" failed while getting total transaction amount', err);
    throw new Error('"getTotalTransactionAmount" job failed: ' + err.message);
>>>>>>> 9f52603bc2b700a597af07535985673d1672e428
  }
}

async function getTotalTransaction() {
  try {
    return countTransaction();
  } catch (err) {
<<<<<<< HEAD
    logger.error('getTotalTransaction failed', { error });
    throw error;
=======
    logger.error('"getTotalTransaction" failed while getting total transaction', err);
    throw new Error('"getTotalTransaction" job failed: ' + err.message);
>>>>>>> 9f52603bc2b700a597af07535985673d1672e428
  }
}

async function getBondedVolumeByRelays() {
  try {
    return getTotalBondedRelays();
  } catch (err) {
<<<<<<< HEAD
    logger.error('getBondedVolumeByRelays failed', { error });
    throw error;
=======
    logger.error('"getBondedVolumeByRelays" failed while getting total volume by Relays', err);
    throw new Error('"getBondedVolumeByRelays" job failed: ' + err.message);
>>>>>>> 9f52603bc2b700a597af07535985673d1672e428
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
