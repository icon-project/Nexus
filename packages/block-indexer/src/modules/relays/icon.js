const { v4: uuidv4 } = require('uuid');
const { logger } = require('../../common');
const {
  updateRelay,
  createRelay,
  getRelayAddresses,
  updateRelayTransaction,
  getRelayByAddress,
} = require('./repository');

const ADD_RELAY_PROTOTYPE = 'addRelay';
const REMOVE_RELAY_PROTOTYPE = 'removeRelay';
let relayAddressSet;

async function handleRelayAction(txResult, transaction) {
  let transData = transaction.data;
  await handleRelayTransaction(txResult.status, transaction.from);

  if (transData && txResult.status == 1) {
    if (ADD_RELAY_PROTOTYPE == transData.method) {
      let params = transData.params;
      let relay = {
        address: params._addr,
        link: params._link,
        registeredTime: new Date(transaction.timestamp / 1000),
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

        // add address to set
        relayAddressSet.add(relay.address);

        logger.debug('Create new a relay');
      }
    } else if (REMOVE_RELAY_PROTOTYPE == transData.method) {
      let params = transData.params;
      await updateRelay({
        address: params._addr,
        unregisteredTime: new Date(transaction.timestamp / 1000),
        serverStatus: 'Inactive',
      });
      // remove address from set
      relayAddressSet.delete(params._addr);
    }
  }
}

async function handleRelayTransaction(txResultStatus, relayAddress) {
  if (!relayAddressSet) {
    const relays = await getRelayAddresses();
    relays.length > 0 ? (relayAddressSet = new Set(relays)) : (relayAddressSet = new Set());
  }

  if (relayAddressSet.has(relayAddress)) {
    await updateRelayTransaction(relayAddress, txResultStatus);
  }
}

module.exports = {
  handleRelayAction,
};
