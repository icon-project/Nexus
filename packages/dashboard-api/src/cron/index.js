/* eslint-disable no-unused-vars */
const { gettingTokenPrice } = require('./token-price');

const cron = require('node-cron');
module.exports = {
  cronStart: async () => {
    await gettingTokenPrice();
    // at every 10 minutes
    cron.schedule(process.env.GET_TOKEN_PRICE, async () => {
      await gettingTokenPrice();
    });
    return true;
  }
};
