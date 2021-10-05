'use strict';

const { getTokenContractAddresses } = require('./repository');

const tokenContractMap = new Map();

function calculateTotalVolume(newTransaction, latestTransaction) {
  let totalVolume = newTransaction.value || 0;

  if (!latestTransaction) {
    return totalVolume;
  }

  totalVolume = Number(latestTransaction.total_volume) + newTransaction.value || 0;
  return totalVolume;
}

// Get list of BSH contract addresses of registered tokens.
async function getTokenContractMap() {
  if (0 === tokenContractMap.size) {
    const addresses = await getTokenContractAddresses();

    // Make all addresses lower case to prevent case sensitive issue on networks i.e. Moonbeam
    for (const address of addresses)
      tokenContractMap.set(address.toLowerCase(), address);
  }

  return tokenContractMap;
}

function updateTokenContractMap(newContract) {
  tokenContractMap.set(newContract.toLowerCase(), newContract);
}

module.exports = {
  calculateTotalVolume,
  getTokenContractMap,
  updateTokenContractMap
};
