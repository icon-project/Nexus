'use strict';

const {
  countTotalRelay,
  getRelayDetailList,
  getRegisteredRelayChange,
  getRelayReward24hAgo,
} = require('./repository');

async function getTotalRelay() {
  return await countTotalRelay();
}

async function getRelayList() {
  let relays = await getRelayDetailList();
  return relays;
}

async function getRelayList24hAgo() {
  let relays = await getRelayReward24hAgo();
  return relays;
}

function calculateReward24hChanged(currentRelays = [], relays24hAgo = []) {
  let totalReward24hAgo = relays24hAgo.reduce((sum, item) => (sum += item.monthlyReward), 0);
  let totalReward = currentRelays.reduce((sum, item) => (sum += item.monthlyReward), 0);

  return totalReward - totalReward24hAgo;
}

async function getRegisteredChangeLast24h() {
  const result = await getRegisteredRelayChange(24 * 60 * 60 * 1000);
  return result ? result.currentCount - result.comparedCount : 0;
}

module.exports = {
  getTotalRelay,
  getRelayList,
  getRegisteredChangeLast24h,
  calculateReward24hChanged,
  getRelayList24hAgo,
};
