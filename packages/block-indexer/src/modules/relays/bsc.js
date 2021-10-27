'use strict';

const debug = require('debug')('bsc_tx');
const Web3 = require('web3');
const { v4: uuidv4 } = require('uuid');
const { ADD_RELAY_ACTION, REMOVE_RELAY_ACTION } = require('../../common');
const logger = require('../../common/logger');
const { getBscActionMap, decodeActionInput } = require('../common/actions');
const { setRelayUnregistered, createRelay } = require('./repository');

const web3 = new Web3(process.env.BSC_API_URL);
const bmcAddress = process.env.BSC_BMC_ADDRESS.toLowerCase();

/* Decoded addRelay input.
Result {
  '0': 'btp://0xd35bbb.icon/cx11db74c77d4b8ac2e30ff5d73341c8c741be75ae',
  '1': [ '0x70E789D2f5D469eA30e0525DbfDD5515d6EAd30D' ],
  __length__: 2,
  _link: 'btp://0xd35bbb.icon/cx11db74c77d4b8ac2e30ff5d73341c8c741be75ae',
  _addr: [ '0x70E789D2f5D469eA30e0525DbfDD5515d6EAd30D' ]
}*/
function getAddRelayAction(encodedInput) {
  try {
    const actionMap = getBscActionMap(web3);
    const result = decodeActionInput(web3, actionMap, ADD_RELAY_ACTION, encodedInput);

    debug('addRelay %O', result);

    return {
      link: result._link,
      addresses: result._addr
    };
  } catch (error) {
    logger.error('bsc:getAddRelayAction fails to decode input %O', error);
  }
}

function getRemoveRelayAction(encodedInput) {
  try {
    const actionMap = getBscActionMap(web3);
    const result = decodeActionInput(web3, actionMap, REMOVE_RELAY_ACTION, encodedInput);

    debug('removeRelay %O', result);

    return {
      link: result._link,
      address: result._addr
    };
  } catch (error) {
    logger.error('bsc:getRemoveRelayAction fails to decode input %O', error);
  }
}

async function handleAddRelayAction(input, tx, block) {
  for (const address of input.addresses) {
    const relay = {
      id: uuidv4(),
      link: input.link,
      address: address.toLowerCase(),
      registeredTime: new Date(web3.utils.hexToNumber(block.timestamp) * 1000),
      serverStatus: 'Active'
    };

    const success = await createRelay(relay);

    if (success)
      logger.info('bsc:handleAddRelayAction registers relay %s at tx %s', relay.link, tx.hash);
  }
}

async function handleRemoveRelayAction(input, tx, block) {
  const relay = {
    address: input.address.toLowerCase(),
    unregisteredTime: new Date(web3.utils.hexToNumber(block.timestamp) * 1000),
    serverStatus: 'Inactive'
  };

  const success = await setRelayUnregistered(relay);

  if (success)
    logger.info('bsc:handleRemoveRelayAction unregisters relay %s at tx %s', relay.address, tx.hash);
}

async function handleRelayActions(tx, txReceipt, block) {
  if (bmcAddress !== tx.to.toLowerCase())
    return false;

  let actionInput = getAddRelayAction(tx.input);

  if (actionInput) {
    logger.info('bsc:handleRelayActions addRelay %O at tx %s', actionInput, tx.hash);
    await handleAddRelayAction(actionInput, tx, block);
    return true;
  }

  actionInput = getRemoveRelayAction(tx.input);

  if (actionInput) {
    logger.info('bsc:handleRelayActions removeRelay %O at tx %s', actionInput, tx.hash);
    await handleRemoveRelayAction(actionInput, tx, block);
    return true;
  }
}

module.exports = {
  handleRelayActions
};
