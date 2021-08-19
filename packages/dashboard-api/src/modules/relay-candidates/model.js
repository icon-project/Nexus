'use strict';

const {
  countTotalRelayCandidates,
  getRelayCandidateList,
  getRelayCAND30DaysAgo,
} = require('./repository');

async function getTotalRelayCandidates() {
  return await countTotalRelayCandidates();
}

async function getRelayCandidates() {
  let relayCandidates = await getRelayCandidateList();
  return relayCandidates;
}

async function getRelayCandidates30DaysAgo() {
  let relays = await getRelayCAND30DaysAgo();
  return relays;
}

function calculateReward30DaysChanged(currentRelays = [], relays30DaysAgo = []) {
  let totalReward30DaysAgo = relays30DaysAgo.reduce((sum, item) => (sum += item.monthlyReward), 0);
  let totalReward = currentRelays.reduce((sum, item) => (sum += item.monthlyReward), 0);
  console.log(totalReward30DaysAgo, totalReward);
  return totalReward - totalReward30DaysAgo;
}

module.exports = {
  getTotalRelayCandidates,
  getRelayCandidates,
  calculateReward30DaysChanged,
  getRelayCandidates30DaysAgo,
};
