/* eslint-disable no-unused-vars */
const { healthCheckBlockIndexer, cachingCurrentBlockHeight } = require('../modules/health-check/models');
const { parseIndexerHealthCheckPeriod } = require('../common/util');

const cron = require('node-cron');
module.exports = {
  cronStart: async () => {
    // This cronjob just run on icon block-indexer ec2
    const indexer = process.argv[2];
    if (indexer.toUpperCase() === 'ICON') {
      const healthCheckParams = parseIndexerHealthCheckPeriod();
      await Promise.all(healthCheckParams.map(async e => {
        cron.schedule(`*/${e.period} * * * *`, async () => {
          await healthCheckBlockIndexer(e.networkId, e.period);
        });
      }));
    }
    return null;
  }
};
