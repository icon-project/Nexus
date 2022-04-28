'use strict';

const { createLogger } = require('../common');
const { getRegisteredTokens } = require('../modules/tokens/model');
const iconIndexer = require('../modules/icon-indexer');
const { Web3BlockIndexer } = require('../modules/web3-indexer');
const nearIndexer = require('../modules/near-indexer');
const moonbeamBshAbi = require('../modules/web3-indexer/abi/moonbeam/abi.bsh_core.json');
const bscBshAbi = require('../modules/web3-indexer/abi/bsc/BSHPeriphery.json');
const { getMoonbeamEventMap, getBscEventMap } = require('../modules/common/events');
const { getMoonbeamActionMap, getBscActionMap } = require('../modules/common/actions');
const Web3 = require('web3');
const logger = createLogger();

async function start(indexerName) {
  const tokens = await getRegisteredTokens();
  logger.info('Registered tokens: %O', tokens);

  const name = indexerName.toUpperCase();
  switch (name) {
    case 'ICON':
      iconIndexer.start();
      break;

    case 'MOONBEAM': {
      const web3 = new Web3(process.env.MOONBEAM_API_URL);

      const eventMap = getMoonbeamEventMap(web3);
      const actionMap = getMoonbeamActionMap(web3);

      const indexer = new Web3BlockIndexer({
        networkName: name,
        blockHeight: Number(process.env.MOONBEAM_BLOCK_HEIGHT),
        networkId: process.env.MOONBEAM_NETWORK_ID,
        endpointUrl: process.env.MOONBEAM_API_URL,
        bshAddress: process.env.MOONBEAM_BSH_CORE_ADDRESS,
        bmcAddress: process.env.MOONBEAM_BMC_ADDRESS,
        bmcManagementAddress: process.env.MOONBEAM_BMC_MANAGEMENT_ADDRESS,
        bshAbi: moonbeamBshAbi
      }, eventMap, actionMap, web3);
      indexer.start();
    }
      break;

    case 'BSC': {
      const web3 = new Web3(process.env.BSC_API_URL);

      const eventMap = getBscEventMap(web3);
      const actionMap = getBscActionMap(web3);

      const indexer = new Web3BlockIndexer({
        networkName: name,
        blockHeight: Number(process.env.BSC_BLOCK_HEIGHT),
        networkId: process.env.BSC_NETWORK_ID,
        endpointUrl: process.env.BSC_API_URL,
        bshAddress: process.env.BSC_BSH_CORE_ADDRESS,
        bmcAddress: process.env.BSC_BMC_ADDRESS,
        bmcManagementAddress: process.env.BSC_BMC_MANAGEMENT_ADDRESS,
        bshAbi: bscBshAbi
      }, eventMap, actionMap, web3);
      indexer.start();
      break;
    }
    case 'NEAR':
      nearIndexer.start();
      break;

    case 'HARMONY': {
      const web3 = new Web3(process.env.HARMONY_API_URL);

      const eventMap = getBscEventMap(web3);
      const actionMap = getBscActionMap(web3);

      const indexer = new Web3BlockIndexer({
        networkName: name,
        blockHeight: Number(process.env.HARMONY_BLOCK_HEIGHT),
        networkId: process.env.HARMONY_NETWORK_ID,
        endpointUrl: process.env.HARMONY_API_URL,
        bshAddress: process.env.HARMONY_BSH_CORE_ADDRESS,
        bmcAddress: process.env.HARMONY_BMC_ADDRESS,
        bmcManagementAddress: process.env.HARMONY_BMC_MANAGEMENT_ADDRESS,
        bshAbi: bscBshAbi
      }, eventMap, actionMap, web3);
      indexer.start();
      break;
    }
    default:
      logger.warn('No indexer started.');
  }
}

module.exports = {
  start
};
