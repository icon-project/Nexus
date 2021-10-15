'use strict';

const { logger } = require('../common');
const { getRegisteredTokens } = require('../modules/tokens/model');
const iconIndexer = require('../modules/icon-indexer');
const moonbeamIndexer = require('../modules/moonbeam-indexer');
const bscIndexer = require('../modules/bsc-indexer');

async function start() {
  const tokens = await getRegisteredTokens();
  logger.info('Registered tokens: %O', tokens);

  if ('true' === process.env.ICON_INDEXER_ENABLED) {
    iconIndexer.start();
  }

  if ('true' === process.env.MOONBEAM_INDEXER_ENABLED) {
    moonbeamIndexer.start();
  }

  if ('true' === process.env.BSC_INDEXER_ENABLED) {
    bscIndexer.start();
  }
}

module.exports = {
  start
};
