'use strict';

const { countTotalRelay, getRelayDetailList } = require('./repository');

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


module.exports = {
  getTotalRelay,
  getRelayList,
};
