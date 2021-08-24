'use strict';

const {
  getRelayCandidateList,
  getTotalRewardLast30Days,
  getTotalReward
} = require('./repository');

async function getTotalMonthlyReward() {
  return await getTotalReward();
}

async function getRelayCandidates() {
  let relayCandidates = await getRelayCandidateList();
  return relayCandidates;
}

async function getRewardLast30DaysChange() {
  const totalReward = await getTotalReward();
  const last30DaysReward = await getTotalRewardLast30Days();

  return totalReward - last30DaysReward;
}

module.exports = {
  getRelayCandidates,
  getRewardLast30DaysChange,
  getTotalMonthlyReward
};
