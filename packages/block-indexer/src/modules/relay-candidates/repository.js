/* eslint-disable quotes */
/* eslint-disable curly */
'use strict';

const IconService = require('icon-sdk-js').default;
const { IconBuilder } = IconService;
const { pgPool } = require('../../common');

async function getRelayerFromContract(iconService) {
  const callBuilder = new IconBuilder.CallBuilder();
  const call = callBuilder.to(process.env.ICON_BMC_ADDRESS).method('getRelayers').build();
  const relayers = await iconService.call(call).execute();
  const relayerMap = new Map();

  for (const address in relayers) {
    relayerMap.set(address, {
      ...relayers[address]
    });
  }

  return relayerMap;
}

async function getRelayerByAddresses(addresses) {
  if (!addresses.length) { return []; }

  const quotedAddresses = addresses.map(a => '\'' + a + '\'');
  const query = `SELECT address FROM relay_candidates WHERE address IN (${quotedAddresses.join(',')})`;
  const { rows } = await pgPool.query(query);

  return rows;
}

async function saveRelayerReward(address, reward) {
  const query = 'UPDATE relay_candidates SET total_reward = $1, updated_time = NOW() WHERE address = $2';
  const values = [reward, address];
  await pgPool.query(query, values);
}

async function saveTotalReward(rewardInfo) {
  const query = 'INSERT INTO relay_candidate_rewards (id, total_reward) VALUES ($1, $2)';
  const values = [rewardInfo.id, rewardInfo.totalReward];
  await pgPool.query(query, values);
}

module.exports = {
  getRelayerFromContract,
  getRelayerByAddresses,
  saveRelayerReward,
  saveTotalReward
};
