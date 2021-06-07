'use strict';

const { logger, pgPool } = require('../../common');
const IconService = require('icon-sdk-js');
const {countNetWork} = require('./repository')
const { HttpProvider } = IconService;
const { IconBuilder } = IconService;

// Create icon services 
const provider = new HttpProvider(process.env.NODE_URL);
const iconService = new IconService(provider);

// Init call builder 
const { CallBuilder } = IconBuilder;
const callBuilder = new CallBuilder();

async function getListToken() {
    const call = callBuilder
        .to(process.env.FEE_AGGREGATION_SCORE_ADDRESS)
        .method('tokens')
        .build();
    try {
        const tokens = await iconService.call(call).execute();
        return tokens;
    } catch (e) {
        logger.error(e, 'getListToken() failed when execute get list tokens');
        throw new Error('"getListToken" job failed: ' + e.message);
    }
}

async function getAmountFeeAggregationSCORE() {
    let result = [];
    const tokens = await getListToken();
    for (let data of tokens) {
        logger.debug(`[getAmountFeeAggregationSCORE] token: ${data.name}, address: ${data.address}`);
        try {
            let hexBalance = await getAvailableBalance(data.name);
            let decBalance = parseInt(hexBalance.toString(16), 16);
            result.push({ name: data.name, value: decBalance })
        } catch (e) {
            logger.error(e, 'getAmountFeeAggregationSCORE() failed when execute get avilable balance');
            throw new Error('"getAmountFeeAggregationSCORE" job failed: ' + e.message);
        }
    }
    return result;
}
async function getTotalCumulativeAmountFeeAggregationSCORE() {
    let result = [];
    const client = await pgPool.connect();
    const tokens = await getListToken();
    for (let data of tokens) {
        let { rows: [{ sum: totalValue }] } = await client.query('SELECT SUM(value) FROM transfer_fees WHERE name_token = $1', [data.name]);
        logger.debug(`[getTotalCumulativeAmountFeeAggregationSCORE] token: ${data.name} total value: ${totalValue}`);
        result.push({ name: data.name, value: parseInt(totalValue, 10) })
    }
    return result;
}

async function getAvailableBalance(nameToken) {
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
    return countNetWork();
  } catch (err) {
    logger.error(err, '"getTotalNetworks" failed while getting total networks');
    throw new Error('"getTotalNetworks" job failed: ' + err.message);
  }
}

module.exports = {
  getAmountFeeAggregationSCORE,
  getTotalCumulativeAmountFeeAggregationSCORE,
  getTotalNetworks,
};
