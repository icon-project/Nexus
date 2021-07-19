'use strict';

const { countTotalRelay, getRelayDetailList, getRegisteredRelayChange } = require('./repository');

async function getTotalRelay() {
  return await countTotalRelay();
}

async function getRelayList() {
  let relays = await getRelayDetailList();

  // TODO it should call to BMC to get total amount of monthly reward fund for Relay Candidate
  // follow this issue to get final discussion https://git.baikal.io/btp-dashboard/pm/-/issues/37
  // just the sameple data
  relays.map(item => item.monthlyReward = Math.random());
  return relays;
}

async function getRegisteredChangeLast24h() {
  const result = await getRegisteredRelayChange(24 * 60 * 60 * 1000);
  return result ? result.currentCount - result.comparedCount : 0;
}

module.exports = {
  getTotalRelay,
  getRelayList,
  getRegisteredChangeLast24h
};
