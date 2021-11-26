'use strict';

const { customAlphabet } = require('nanoid/async');
const { hexToIcxUnit } = require('../../common');
const { saveRelayerReward, saveTotalReward } = require('./repository');

const nanoId = customAlphabet('1234567890abcdef', 10);

async function updateReward(rewards, relayers) {
  let totalReward = 0;
  for (const relayer of relayers) {
    const relayerReward = hexToIcxUnit(rewards.get(relayer.address).reward);
    totalReward += relayerReward;
    await saveRelayerReward(relayer.address, relayerReward);
  }

  const totalRewardInfo = {
    id: await nanoId(),
    totalReward
  }
  await saveTotalReward(totalRewardInfo);
}

module.exports = {
  updateReward
};
