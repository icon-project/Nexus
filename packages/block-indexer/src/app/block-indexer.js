'use strict';

const { createLogger } = require('../common');
const { getRegisteredTokens } = require('../modules/tokens/model');
const iconIndexer = require('../modules/icon-indexer');
const moonbeamIndexer = require('../modules/web3-indexer');
const bscIndexer = require('../modules/bsc-indexer');
const nearIndexer = require('../modules/near-indexer');

const logger = createLogger();

async function start(indexerName) {
  const tokens = await getRegisteredTokens();
  logger.info('Registered tokens: %O', tokens);

  const name = indexerName.toUpperCase();

  switch (name) {
    case 'ICON':
      iconIndexer.start();
      break;

    case 'MOONBEAM':
      moonbeamIndexer.start();
      break;

    case 'BSC':
      bscIndexer.start();
      break;

    case 'NEAR':
      nearIndexer.start();
      break;

    default:
      logger.warn('No indexer started.');
  }
}

module.exports = {
  start
};
