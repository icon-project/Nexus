'use strict';

const { createLogger, BLOCK_INDEXER_BUG_GET_BLOCK_HEIGHT } = require('../common');
const logger = createLogger();
const { getAllIndexerStats, getIndexerStatByNetworkId } = require('../modules/indexer-stats/repository');
const { sendErrorToSlack } = require('../slack-bot');
const moment = require('moment');

// caching current indexerStats
const indexerBlockHeight = new Map();

const cachingCurrentBlockHeight = async () => {
  const allIndexerStats = await getAllIndexerStats();
  allIndexerStats.map(e => {
    if (!indexerBlockHeight.get(e.networkId)) {
      indexerBlockHeight.set(e.networkId, e);
      return null;
    }
    return null;
  });
};

// Health check network each some minutes
const healthCheckBlockIndexer = async (networkIds = []) => {
  try {
    await Promise.all(networkIds.map(async id => {
      const indexerStat = await getIndexerStatByNetworkId(id);
      // if blockheight in cache is the same as in database => block-indexer has a problem and cannot get blockheight
      // => Push an error alert to slack
      const cache = indexerBlockHeight.get(id);
      if (indexerStat && cache && indexerStat.blockHeight > 0 && indexerStat.blockHeight === cache.blockHeight) {
        const formatTime = moment().format('YYYY-MM-DD HH:mm:ss');
        const message = BLOCK_INDEXER_BUG_GET_BLOCK_HEIGHT(formatTime, cache.name);
        await sendErrorToSlack(message);
      } else if (indexerStat) {
        // update cache
        indexerBlockHeight.set(id, indexerStat);
      }
    }));
  } catch (error) {
    logger.error(error);
  }
};

module.exports = {
  cachingCurrentBlockHeight,
  healthCheckBlockIndexer
};
