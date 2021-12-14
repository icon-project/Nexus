'use strict';

const debug = require('debug')('near');
const nearApi = require('near-api-js');
const { createLogger, CONTRACT_ZERO_ADDRESS, MINT_EVENT, BURN_EVENT } = require('../../common');
const { getTokenName } = require('../tokens/model');
const { getTotalTokenAmount, saveToken } = require('./repository');

const logger = createLogger();

async function getTokenInfo(encodedId, encodedValue) {
}

async function getMintBurnEvent(txResult) {
  try {
  } catch (error) {
    logger.error('getMintBurnEvent get incorrect eventLogs %O', error);
  }
}

async function handleMintBurnEvents(txResult, block) {
  if (process.env.NEAR_BMC_ADDRESS !== txResult.transaction.signer_id)
    return false;

  try {
    const event = await getMintBurnEvent(txResult);

    if (event && event.tokenName) {
      logger.warn(`handleMintBurnEvents token ${event.tokenId} not registered in ${txResult.transaction.hash}`);
      return false;
    } else {
      logger.info(`handleMintBurnEvents get TransferBatch event in ${txResult.transaction.hash}`);
    }

    if (CONTRACT_ZERO_ADDRESS === txResult.eventLogs[0].indexed[2]) {
      logger.info(`Mint ${event.tokenValue} ${event.tokenName} in ${txResult.transaction.hash}`);

      const totalMintToken = await getTotalTokenAmount(event.tokenName, MINT_EVENT);
      await saveToken(event, totalMintToken, MINT_EVENT);
    } else if (CONTRACT_ZERO_ADDRESS === txResult.eventLogs[0].indexed[3]) {
      logger.info(`Burn ${event.tokenValue} ${event.tokenName} in ${txResult.transaction.hash}`);

      const totalBurnToken = await getTotalTokenAmount(event.tokenName, BURN_EVENT);
      await saveToken(event, totalBurnToken, BURN_EVENT);
    }
  } catch (error) {
    logger.error('handleMintBurnEvents failed %O', error);
  }
}

module.exports = {
  handleMintBurnEvents
};
