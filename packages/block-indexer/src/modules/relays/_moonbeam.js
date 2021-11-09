const debug = require('debug')('moonbeam_tx');
const Web3 = require('web3');
const { v4: uuidv4 } = require('uuid');
const { logger } = require('../../common');
const { getActionMap } = require('../moonbeam-indexer/actions');
const {
  getRelayByAddress,
  updateRelay,
  createRelay,
  updateRelayTransaction,
  getRelayAddresses,
} = require('./repository');

const ADD_RELAY_PROTOTYPE = 'addRelay';
const REMOVE_RELAY_PROTOTYPE = 'removeRelay';
const ADD_RELAY_PARAMS_STRUCTURE = ['string', 'address[]'];
const REMOVE_RELAY_PARAMS_STRUCTURE = ['string', 'address'];
const SUCCESS_ACTION = 'Returned';
const bmcMgmtAddress = process.env.MOONBEAM_BMC_MANAGEMENT_ADDRESS.toLowerCase();

let relayAddressSet;

const web3 = new Web3(process.env.MOONBEAM_API_URL);

function destructureTransactionInput(transaction, innerTx, actionName, structure) {
  const actionMap = getActionMap();
  const relayAction = actionMap.get(actionName);
  let regrex = new RegExp(`(${relayAction.hash})|\\w+`, 'g');

  // split the function name hashed and action params
  let transInputs = innerTx.input.match(regrex);

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
      address: relayAddress.toLowerCase(),
      link: linkToBMC,
      registeredTime: new Date(Number(block.extrinsics[0].args.now)),
      unregisteredTime: null,
      id: uuidv4(),
      serverStatus: 'Active',
    };

    const relayResult = await getRelayByAddress(relay.address);

    if (relayResult) {
      await updateRelay(relay);
      logger.info('moonbeam:handleAddRelayAction updates relay %s at tx %s', relay.link, transaction.hash);
    } else {
      await createRelay(relay);
      relayAddressSet.add(relay.address);
      logger.info('moonbeam:handleAddRelayAction registers relay %s at tx %s', relay.link, transaction.hash);
    }
  }
}

async function handleRemoveRelayAction(relayInput, transaction, block) {
  let address = relayInput[1];

  await updateRelay({
    address: address.toLowerCase(),
    unregisteredTime: new Date(Number(block.extrinsics[0].args.now)),
    serverStatus: 'Inactive',
  });

  relayAddressSet.delete(address);
  logger.info('moonbeam:handleRemoveRelayAction unregisters relay %s at tx %s', address, transaction.hash);
}

async function handleRelayActions(transaction, block) {
  // Only interested in Ethereum transactions.
  if ('ethereum' !== transaction.method.pallet || 'transact' !== transaction.method.method)
    return false;

  // Cache relay addresses and count tx handled by relays.
  await handleRelayTransaction(transaction);

  const innerTx = transaction.args.transaction;

  if (innerTx && bmcMgmtAddress === innerTx.action.call) {
    debug('BMC transaction: %O', transaction);

    const addRelayInput = destructureTransactionInput(
      transaction,
      innerTx,
      ADD_RELAY_PROTOTYPE,
      ADD_RELAY_PARAMS_STRUCTURE,
    );

    if (addRelayInput) {
      await handleAddRelayAction(addRelayInput, transaction, block);
    } else {
      const removeRelayInput = destructureTransactionInput(
        transaction,
        innerTx,
        REMOVE_RELAY_PROTOTYPE,
        REMOVE_RELAY_PARAMS_STRUCTURE,
      );

      if (removeRelayInput) {
        await handleRemoveRelayAction(removeRelayInput, transaction, block);
      }
    }
  }

  return true;
}

async function handleRelayTransaction(transaction) {
  if (!relayAddressSet) {
    const relays = await getRelayAddresses();
    relays.length > 0 ? (relayAddressSet = new Set(relays)) : (relayAddressSet = new Set());
  }

  const eventData = transaction.events[0].data;

  if (eventData) {
    const relayAddress = eventData[0];

    if (relayAddressSet.has(relayAddress) && eventData[3]) {
      const transactionStatus = eventData[3].succeed === SUCCESS_ACTION ? 1 : 0;
      await updateRelayTransaction(relayAddress, transactionStatus);
    }
  }
}

module.exports = {
  handleRelayActions
};
