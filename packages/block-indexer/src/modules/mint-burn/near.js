'use strict';

const debug = require('debug')('near');
const { createLogger } = require('../../common');
const { getTokenName } = require('../tokens/model');
const { getTotalTokenAmount, saveToken } = require('./repository');

const logger = createLogger();

async function getTokenInfo(encodedId, encodedValue) {
}

async function getMintBurnEvent(txResult, transaction) {
  try {
  } catch (error) {
    logger.error('icon:getMintBurnEvent incorrect eventLogs %O', error);
  }
}

async function handleMintBurnEvents(txResult, block) {
}

module.exports = {
  handleMintBurnEvents
};
