'use strict';

const { logger, BLOCK_INDEXER_STOPPED, parseIndexerHealthCheckPeriod, BLOCK_INDEXER_HEALTHY } = require('../../common');
const { getIndexerStatByNetworkId } = require('../indexer-stats/repository');
const moment = require('moment');

const indexerCommandHealthCheck = async () => {
  try {
    const healthCheckParams = parseIndexerHealthCheckPeriod();
    const messages = await Promise.all(healthCheckParams.map(async e => {
      const indexerStat = await getIndexerStatByNetworkId(e.networkId);
      const updateAt = moment(indexerStat.updateAt);
      const checkTime = moment().subtract(e.period, 'minutes');
      // If indexerStat.updatAt < currentTime - period => Push error to slack
      if (!updateAt.isValid() || updateAt.isBefore(checkTime)) {
        return BLOCK_INDEXER_STOPPED(indexerStat.blockHeight, indexerStat.name);
      } else {
        return BLOCK_INDEXER_HEALTHY(indexerStat.blockHeight, indexerStat.name);
      }
    }));
    return messages.join('\n');
  } catch (error) {
    logger.error(error);
    return null;
  }
};

module.exports = {
  indexerCommandHealthCheck
};
