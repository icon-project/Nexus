/* eslint-disable indent */
'use strict';
const IconService = require('icon-sdk-js').default;
const { HttpProvider } = IconService;
const provider = new HttpProvider(process.env.ICON_API_URL);
const iconService = new IconService(provider);
const Web3 = require('web3');
const nearApi = require('near-api-js');
const { logger } = require('../../common');
const { createTransactionIP, getTransactionIP } = require('./repository');
const networkModel = require('../networks/model');
const networkMap = new Map();

const getNetworkInCache = async (networkId) => {
  const networkInCache = networkMap.get(networkId);
  // Save network in cache
  if (networkInCache === undefined) {
    const networkList = await networkModel.getNetworkByIdInDB(networkId);
    if (networkList.length > 0) {
      networkMap.set(networkId, networkList[0]);
    }
  }
  return networkMap.get(networkId);
};

// Get transaction object by txHash and networkId. If network is NEAR, the param needs signerId
const getTransactionReceipt = async ({ txHash, networkId, signerId }) => {
  try {
    // validate txHash
    let txObject = null;
    let web3 = null;
    if (networkId === process.env.ICON_NETWORK_ID) {
      // ICON
      txObject = await iconService.getTransactionResult(txHash).execute();
    } else if (networkId === process.env.NEAR_NETWORK_ID) {
      // NEAR
      const provider = new nearApi.providers.JsonRpcProvider(process.env.NEAR_API_URL);
      txObject = await provider.txStatus(txHash, signerId);
    } else {
      switch (networkId) {
        // MOONBEAM
        case process.env.MOONBEAM_NETWORK_ID:
          web3 = new Web3(process.env.MOONBEAM_API_URL);
          break;
        // BSC
        case process.env.BSC_NETWORK_ID:
          web3 = new Web3(process.env.BSC_API_URL);
          break;
        // HARMONY
        case process.env.HARMONY_NETWORK_ID:
          web3 = new Web3(process.env.HARMONY_API_URL);
          break;
        default:
          break;
      }
      if (web3) {
        txObject = await web3.eth.getTransactionReceipt(txHash);
      }
    }
    return txObject;
  } catch (error) {
    logger.error(error);
    return null;
  }
};

module.exports = {
  createTransactionIP,
  getTransactionIP,
  getTransactionReceipt,
  getNetworkInCache
};
