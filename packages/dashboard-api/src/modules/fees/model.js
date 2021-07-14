'use strict';

const { getAvailableFeeChange } = require('./repository');

async function getAvailableFeeChangeLast24h() {
  const result = await getAvailableFeeChange(24 * 60 * 60 * 1000);
  console.log(result);

  if (result) {
    const percentage = (result.currentFee - result.comparedFee) / result.comparedFee * 100;
    return Number(percentage.toFixed(2));
  }
}

module.exports = {
  getAvailableFeeChangeLast24h
};
