/* eslint-disable no-unused-vars */
const { startRewardReader } = require('./reward-reader');

const cron = require('node-cron');
module.exports = {
  cronStart: async () => {
    // At 00:00 everyday
    cron.schedule(process.env.RELAYER_GET_REWARD, async () => {
      await startRewardReader();
    });
    return true;
  }
};
