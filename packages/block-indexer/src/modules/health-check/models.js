'use strict';

const { createLogger, BLOCK_INDEXER_STOPPED } = require('../../common');
const logger = createLogger();
const { getIndexerStatByNetworkId } = require('../indexer-stats/repository');
const { sendErrorToSlack } = require('../../slack-bot');
const moment = require('moment');

// Health check network each some minutes
const healthCheckBlockIndexer = async (networkId, period) => {
  try {
    const indexerStat = await getIndexerStatByNetworkId(networkId);
    if (!indexerStat) {
      return null;
    }
    const checkTime = moment().subtract(period, 'minutes');
    // If indexerStat.updateAt is null or indexerStat.updatAt < currentTime - period => Push error to slack
    if (!moment(indexerStat.updateAt).isValid() || (moment(indexerStat.updateAt).isValid() && moment(indexerStat.updateAt).isBefore(checkTime))) {
      const message = BLOCK_INDEXER_STOPPED(indexerStat.blockHeight, indexerStat.name);
      await sendErrorToSlack(message);
    }
  } catch (error) {
    logger.error(error);
  }
};

module.exports = {
  healthCheckBlockIndexer
};
