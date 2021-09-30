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
        logger.info('icon:handleRelayAction updates relay %s at tx %s', relay.link, transaction.txHash);
      } else {
        await createRelay(relay);

        // add address to set
        relayAddressSet.add(relay.address);

        logger.info('icon:handleRelayAction registers relay %s at tx %s', relay.link, transaction.txHash);
      }
    } else if (REMOVE_RELAY_PROTOTYPE == transData.method) {
      let params = transData.params;

      await updateRelay({
        address: params._addr,
        unregisteredTime: new Date(transaction.timestamp / 1000),
        serverStatus: 'Inactive',
      });

      logger.info('icon:handleRelayAction unregisters relay %s at tx %s', params._addr, transaction.txHash);

      // remove address from set
      relayAddressSet.delete(params._addr);
    }
  }
}

async function handleRelayTransaction(txResultStatus, relayAddress) {
  if (!relayAddressSet) {
    const relays = await getRelayAddresses();

    if (relays)
      relays.length > 0 ? (relayAddressSet = new Set(relays)) : (relayAddressSet = new Set());
  }

  if (relayAddressSet && relayAddressSet.has(relayAddress)) {
    await updateRelayTransaction(relayAddress, txResultStatus);
  }
}

module.exports = {
  handleRelayAction,
};
