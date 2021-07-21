'use strict';

const {
  countTotalRelay,
  getRelayDetailList,
  getRegisteredRelayChange,
  getRelayReward30DaysAgo,
} = require('./repository');

async function getTotalRelay() {
  return await countTotalRelay();
}

async function getRelayList() {
  let relays = await getRelayDetailList();
  return relays;
}

async function getRelayList30DaysAgo() {
  let relays = await getRelayReward30DaysAgo();
  return relays;
}

function calculateReward30DaysChanged(currentRelays = [], relays30DaysAgo = []) {
  let totalReward30DaysAgo = relays30DaysAgo.reduce((sum, item) => (sum += item.monthlyReward), 0);
  let totalReward = currentRelays.reduce((sum, item) => (sum += item.monthlyReward), 0);

  return totalReward - totalReward30DaysAgo;
}

async function getRegisteredChangeLast24h() {
  const result = await getRegisteredRelayChange(24 * 60 * 60 * 1000);
  return result ? result.currentCount - result.comparedCount : 0;
}

module.exports = {
  getTotalRelay,
  getRelayList,
  getRegisteredChangeLast24h,
  calculateReward30DaysChanged,
  getRelayList30DaysAgo,
};
