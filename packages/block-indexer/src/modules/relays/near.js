'use strict';

const { Buffer } = require('buffer');
const debug = require('debug')('near_tx');
const { createLogger, ADD_RELAY_ACTION, REMOVE_RELAY_ACTION } = require('../../common');
const { createRelay, setRelayUnregistered } = require('./repository');

const bmcAddress = process.env.NEAR_BMC_ADDRESS;
const logger = createLogger();

async function handleAddRelayAction(tx, block) {
  const args = Buffer.from(tx.actions[0].FunctionCall.args, 'base64');
  const params = JSON.parse(args);

  logger.info('handleAddRelayAction %O at tx %s', params, tx.hash);

  const relay = {
    txHash: tx.hash,
    link: params._link,
    address: params._addr[0],
    registeredTime: new Date(Math.floor(block.header.timestamp / 10 ** 6)),
    serverStatus: 'Active'
  };

  const success = await createRelay(relay);

  if (success)
    logger.info(`handleAddRelayAction registered relay ${relay.link} in ${tx.hash}`);
}

async function handleRemoveRelayAction(tx, block) {
  const args = Buffer.from(tx.actions[0].FunctionCall.args, 'base64');
  const params = JSON.parse(args);

  logger.info('handleRemoveRelayAction %O at tx %s', params, tx.hash);

  const relay = {
    address: params._addr,
    unregisteredTime: new Date(Math.floor(block.header.timestamp / 10 ** 6)),
    serverStatus: 'Inactive'
  };

  const success = await setRelayUnregistered(relay);

  if (success)
    logger.info(`handleRemoveRelayAction unregistered relay ${relay.address} in ${tx.hash}`);
}

async function handleRelayActions(txResult, block) {
  if (bmcAddress !== txResult.transaction.signer_id || !txResult.transaction.actions[0])
    return false;

  const action = txResult.transaction.actions[0];

  if (!action.FunctionCall)
    return false;

  if (ADD_RELAY_ACTION === action.FunctionCall.method_name) {
    await handleAddRelayAction(txResult.transaction, block);
  } else if (REMOVE_RELAY_ACTION === action.FunctionCall.method_name) {
    await handleRemoveRelayAction(txResult.transaction, block);
  }
}

module.exports = {
  handleRelayActions
};
