/* eslint-disable quotes */
'use strict';
const { logger } = require('../../common');
const { getTransactionIP } = require('./repository');

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function retryGetTransactionIP(txHash, networkId) {
  try {
    let ip = null;
    let countLoop = 0;
    while (true) {
      ip = await getTransactionIP(txHash, networkId);
      await countLoop++;
      if (ip !== null || countLoop >= 5) {
        break;
      }
      await sleep(5000);
    }
    return ip;
  } catch (error) {
    logger.error(error);
    return null;
  }
}

module.exports = {
  retryGetTransactionIP
};
