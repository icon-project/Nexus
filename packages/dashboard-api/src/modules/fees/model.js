'use strict';

const { logger, tokenToUsd, CURRENCIES } = require('../../common');
const { getAvailableFeeChange } = require('./repository');

async function getAvailableFeeChangeLast24h() {
  const result = await getAvailableFeeChange(24 * 60 * 60 * 1000);

  if (result) {
    let fiat1, fiat2;

    try {
      const promises1 = result.latestTokens.map(t => tokenToUsd(t.name, t.value));
      fiat1 = await Promise.all(promises1);
      const promises2 = result.last24hTokens.map(t => tokenToUsd(t.name, t.value));
      fiat2 = await Promise.all(promises2);
    } catch (error) {
      logger.error('Fails to convert token to fiat money', { error });
      return 0;
    }

    const totalLatestFee = fiat1.reduce((total, item) => total + item, 0);
    const totalLast24hFee = fiat2.reduce((total, item) => total + item, 0);

    const percentage = (totalLatestFee - totalLast24hFee) / totalLast24hFee * 100;
    return Number(percentage.toFixed(2));
  }

  return 0;
}

module.exports = {
  getAvailableFeeChangeLast24h
};
