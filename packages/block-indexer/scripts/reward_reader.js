'use strict';

const path = require('path');
const IconService = require('icon-sdk-js').default;
const { HttpProvider } = IconService;

require('dotenv-safe').config({
  silent: true,
  allowEmptyValues: true,
  path: path.resolve(__dirname, '../.env'),
  example: '../.env.example'
});

const { getRelayerFromContract, getRelayerByAddresses } = require('../src/modules/relay-candidates/repository');
const { updateReward } = require('../src/modules/relay-candidates/model');

const httpProvider = new HttpProvider(process.env.ICON_API_URL);
const iconService = new IconService(httpProvider);

async function start() {
  console.log('Start update relay candidate rewards');

  const relayerMap = await getRelayerFromContract(iconService);
  console.log('getRelayersFromContract', relayerMap);

  const relayers = await getRelayerByAddresses(Array.from(relayerMap.keys()));
  console.log('getRelayerByAddresses', relayers);

  await updateReward(relayerMap, relayers);

  console.log('End update relay candidate rewards');
}

(async function () {
  await start();
})();
