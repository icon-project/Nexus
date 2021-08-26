'use strict';
const IconService = require('icon-sdk-js');
const { hexToIcxUnit, logger } = require('../../common');
const {
  getRelayCandidateList,
  getTotalRewardLast30Days,
  getTotalReward,
  countTotalRelayCandidates,
} = require('./repository');

const { HttpProvider, IconBuilder } = IconService;

const provider = new HttpProvider(process.env.ICON_API_URL);
const iconService = new IconService(provider);

async function getTotalRelayCandidates() {
  return await countTotalRelayCandidates();
}

async function getTotalMonthlyReward() {
  return await getTotalReward();
}

async function getRelayCandidates(page, limit) {
  let relayCandidates = await getRelayCandidateList(page, limit);
  let relayersOnchain = await getRelayerInfoOnChain();
  let rankRelayers = rankRelayer(relayersOnchain);

  for (let relayer of relayCandidates) {
    relayer.rank = rankRelayers[relayer.address] ? rankRelayers[relayer.address].rank : 0;
  }

  return relayCandidates;
}

async function rankRelayer(relayersOnchain) {
  let relayers = { ...relayersOnchain };
  let rewards = new Set(
    Object.keys(relayers).map((key) => {
      return relayers[key].reward;
    }),
  );

  let orderedRewards = Array.from(rewards).sort((a, b) => {
    return a - b;
  });

  Object.keys(relayers).forEach((key) => {
    let relayer = relayers[key];
    relayer.rank = orderedRewards.indexOf(relayer.reward) + 1;
  });
  return relayers;
}

async function getRelayerInfoOnChain() {
  const callBuilder = new IconBuilder.CallBuilder();
  const call = callBuilder.to(process.env.ICON_BMC_SCORE).method('getRelayers').build();
  try {
    const relayers = await iconService.call(call).execute();

    return relayers;
  } catch (error) {
    logger.error('getBondedVolumeByRelayCandidates failed', { error });
    throw error;
  }
}

async function getRewardLast30DaysChange() {
  const totalReward = await getTotalReward();
  const last30DaysReward = await getTotalRewardLast30Days();

  return totalReward - last30DaysReward;
}

module.exports = {
  getRelayCandidates,
  getRewardLast30DaysChange,
  getTotalMonthlyReward,
  getTotalRelayCandidates,
};
