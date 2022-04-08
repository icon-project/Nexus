'use strict';

const path = require('path');
const IconService = require('icon-sdk-js').default;
const { HttpProvider } = IconService;

const rootPath = require('path').resolve(__dirname, '../..');
require('dotenv-safe').config({
  silent: true,
  allowEmptyValues: true,
  path: path.resolve(__dirname, `${rootPath}/.env`),
  example: `${rootPath}/.env.example`
});
const { createLogger } = require('../common/logger');
const logger = createLogger();

const { getRelayerFromContract, getRelayerByAddresses } = require('../modules/relay-candidates/repository');
const { updateReward } = require('../modules/relay-candidates/model');

const httpProvider = new HttpProvider(process.env.ICON_API_URL);
const iconService = new IconService(httpProvider);

async function startRewardReader() {
  logger.info('Getting token prices everyday..........' + (new Date()).toISOString());
  const relayerMap = await getRelayerFromContract(iconService);
  logger.info('getRelayersFromContract', relayerMap);

  const relayers = await getRelayerByAddresses(Array.from(relayerMap.keys()));
  logger.info('getRelayerByAddresses', relayers);

  await updateReward(relayerMap, relayers);
}

module.exports = {
  startRewardReader
};
