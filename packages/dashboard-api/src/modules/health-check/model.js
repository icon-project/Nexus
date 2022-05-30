'use strict';

const { logger, BLOCK_INDEXER_STOPPED, parseIndexerHealthCheckPeriod, BLOCK_INDEXER_HEALTHY } = require('../../common');
const { getIndexerStatByNetworkId } = require('../indexer-stats/repository');
const moment = require('moment');

const indexerCommandHealthCheck = async () => {
  try {
    const healthCheckParams = parseIndexerHealthCheckPeriod();
    let message = '';
    await Promise.all(healthCheckParams.map(async e => {
      const indexerStat = await getIndexerStatByNetworkId(e.networkId);
      const updateAt = moment(indexerStat.updateAt);
      const checkTime = moment().subtract(e.period, 'minutes');
      // If indexerStat.updatAt < currentTime - period => Push error to slack
      if (!updateAt.isValid() || updateAt.isBefore(checkTime)) {
        message += BLOCK_INDEXER_STOPPED(indexerStat.blockHeight, indexerStat.name) + '\n';
      } else {
        message += BLOCK_INDEXER_HEALTHY(indexerStat.blockHeight, indexerStat.name) + '\n';
      }
      return null;
    }));
    return message;
  } catch (error) {
    logger.error(error);
    return null;
  }
};

module.exports = {
  indexerCommandHealthCheck
};
