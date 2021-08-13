'use strict';

function calculateTotalVolume(newTransaction, latestTransaction) {
  let totalVolume = newTransaction.value || 0;
  if (!latestTransaction) {
    return totalVolume;
  }
  totalVolume = Number(latestTransaction.totalVolume) + newTransaction.value || 0;

  return totalVolume;
}

module.exports = {
  calculateTotalVolume
};
