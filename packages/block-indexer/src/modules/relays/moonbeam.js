const Web3 = require('web3');
const { v4: uuidv4 } = require('uuid');
const { logger } = require('../../common');
const { debug } = require('../../common/logger');
const { getActionMap } = require('../moonbeam-indexer/actions');
const { getRelayByAddress, updateRelay, createRelay } = require('./repository');

const ADD_RELAY_PROTOTYPE = 'addRelay';
const REMOVE_RELAY_PROTOTYPE = 'removeRelay';
const ADD_RELAY_PARAMS_STRUCTURE = ['string', 'address[]'];
const REMOVE_RELAY_PARAMS_STRUCTURE = ['string', 'address'];
const SUCCESS_ACTION = 'Returned';
const FAILED_ACTION = 'Reverted';

const web3 = new Web3(process.env.MOONBEAM_API_URL);

function destructureTransactionInput(transaction, transactionInside, actionName, structure) {
  const actionMap = getActionMap();
  const relayAction = actionMap.get(actionName);
  let regrex = new RegExp(`(${relayAction.hash})|\\w+`, 'g');
  // split the function name hashed and action params
  let transInputs = transactionInside.input.match(regrex);
  /**
   *  Event data of an action succeed
   * ["0xf24ff3a9cf04c71dbc94d0b566f7a27b94566cac",
   * "0x0000000000000000000000000000000000000000",
   * "0x59c65603d2ddb74c994ca3d039f02d9cf96c8903ddf1824325f9f81aabd2d1d5",
   * {"succeed":"Returned"}]
   */
  let eventData = transaction.events[0].data;
  if (
    transInputs[0] === relayAction.hash &&
    eventData[3] &&
    eventData[3].succeed === SUCCESS_ACTION
  ) {
    return web3.eth.abi.decodeParameters(structure, transInputs[1]);
  }
  return null;
}

async function handleAddRelayAction(relayInput, transaction, block) {
  let linkToBMC = relayInput[0];
  let addresses = relayInput[1];

  for (const relayAddress of addresses) {
    let relay = {
      address: relayAddress,
      link: linkToBMC,
      registeredTime: new Date(Number(block.extrinsics[0].args.now)),
      unregisteredTime: null,
      id: uuidv4(),
      serverStatus: 'Active',
    };
    const relayResult = await getRelayByAddress(relay.address);

    if (relayResult) {
      await updateRelay(relay);
      logger.debug('Register the relay again');
    } else {
      await createRelay(relay);
      logger.debug('Create new a relay');
    }
  }
}

async function handleRemoveRelayAction(relayInput, transaction, block) {
  let addresse = relayInput[1];
  await updateRelay({
    address: addresse,
    unregisteredTime: new Date(Number(block.extrinsics[0].args.now)),
    serverStatus: 'Inactive',
  });
}

async function handleRelayAction(transaction, block) {
  // Only interested in Ethereum transactions.
  if ('ethereum' !== transaction.method.pallet || 'transact' !== transaction.method.method)
    return false;

  let transactionInside = transaction.args.transaction;
  if (
    transactionInside &&
    process.env.MOONBEAM_BMC_CORE_ADDRESS === transactionInside.action.call
  ) {
    debug('Transaction: %O', transaction);

    let addRelayInput = destructureTransactionInput(
      transaction,
      transactionInside,
      ADD_RELAY_PROTOTYPE,
      ADD_RELAY_PARAMS_STRUCTURE,
    );
    let removeRelayInput = destructureTransactionInput(
      transaction,
      transactionInside,
      REMOVE_RELAY_PROTOTYPE,
      REMOVE_RELAY_PARAMS_STRUCTURE,
    );

    if (addRelayInput) {
      await handleAddRelayAction(addRelayInput, transaction, block);
    }

    if (removeRelayInput) {
      await handleRemoveRelayAction(removeRelayInput, transaction, block);
    }
  }

  return true;
}

module.exports = {
  handleRelayAction,
};
