'use strict';

const { logger, BLOCK_INDEXER_STOPPED, parseIndexerHealthCheckPeriod, BLOCK_INDEXER_HEALTHY } = require('../../common');
const { getIndexerStatByNetworkId } = require('../indexer-stats/repository');
const moment = require('moment');

const indexerCommandHealthCheck = async (indexerName) => {
  try {
    let indexerCheckParams = null;
    let indexerStat = null;
    const healthCheckParams = parseIndexerHealthCheckPeriod();
    await Promise.all(healthCheckParams.map(async e => {
      if (e.name.toUpperCase() === indexerName.toUpperCase()) {
        indexerCheckParams = e;
        indexerStat = await getIndexerStatByNetworkId(e.networkId);
      }
      return null;
    }));

    // If server does not have the indexer checking params from .env or the indexer from client does not exist in database => return null
    if (!indexerCheckParams || !indexerStat) {
      return null;
    }

    const updateAt = moment(indexerStat.updateAt);
    const checkTime = moment().subtract(indexerCheckParams.period, 'minutes');
    // If indexerStat.updatAt < currentTime - period => Push error to slack
    if (!updateAt.isValid() || updateAt.isBefore(checkTime)) {
      return BLOCK_INDEXER_STOPPED(indexerStat.blockHeight, indexerStat.name);
    } else {
      return BLOCK_INDEXER_HEALTHY(indexerStat.blockHeight, indexerStat.name);
    }
  } catch (error) {
    logger.error(error);
    return null;
  }
};

module.exports = {
  indexerCommandHealthCheck
};
