/* eslint-disable no-unused-vars */
const { healthCheckBlockIndexer, cachingCurrentBlockHeight } = require('./health-check');

const cron = require('node-cron');
module.exports = {
  cronStart: async () => {
    // This cronjob just run on icon block-indexer ec2
    const indexer = process.argv[2];
    if (indexer.toUpperCase() === 'ICON') {
      await cachingCurrentBlockHeight();
      const iconTimeChecking = 5; // minutes
      const harmonyTimeChecking = 10; // minutes
      cron.schedule(`*/${iconTimeChecking} * * * *`, async () => {
        await healthCheckBlockIndexer([process.env.ICON_NETWORK_ID, process.env.BSC_NETWORK_ID]);
      });

      cron.schedule(`*/${harmonyTimeChecking} * * * *`, async () => {
        await healthCheckBlockIndexer([process.env.HARMONY_NETWORK_ID]);
      });
    }
    return null;
  }
};
