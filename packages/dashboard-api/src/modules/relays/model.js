'use strict';

const { countTotalRelay, getRelayDetailList, getRegisteredRelayChange } = require('./repository');

async function getTotalRelay() {
  return await countTotalRelay();
}

async function getRelayList(page, limit) {
  let relays = await getRelayDetailList(page, limit);
  return relays;
}

async function getRegisteredLast24hChange() {
  const result = await getRegisteredRelayChange(24 * 60 * 60 * 1000);
  return result ? result.currentCount - result.comparedCount : 0;
}

module.exports = {
  getTotalRelay,
  getRelayList,
  getRegisteredLast24hChange,
};
