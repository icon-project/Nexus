const { v4: uuidv4 } = require('uuid');
const { logger } = require('../../common');
const {
  updateRelay,
  createRelay,
  updateRelayTransaction,
  getRelayByAddress,
} = require('./repository');
const { getRegisteredRelayMap } = require('./model');

const ADD_RELAY_PROTOTYPE = 'addRelay';
const REMOVE_RELAY_PROTOTYPE = 'removeRelay';

async function handleRelayAction(txResult, transaction) {
  const relayMap = await getRegisteredRelayMap();

  // Count tx handled by relays.
  if (relayMap.has(transaction.from))
    await updateRelayTransaction(transaction.from, txResult.status);

  const txData = transaction.data;

  if (txData && txResult.status == 1) {
    if (ADD_RELAY_PROTOTYPE == txData.method) {
      let params = txData.params;
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

        relayMap.set(relay.address, relay.address);
        logger.info('icon:handleRelayAction registers relay %s at tx %s', relay.link, transaction.txHash);
      }
    } else if (REMOVE_RELAY_PROTOTYPE == txData.method) {
      let params = txData.params;

      await updateRelay({
        address: params._addr,
        unregisteredTime: new Date(transaction.timestamp / 1000),
        serverStatus: 'Inactive',
      });

      logger.info('icon:handleRelayAction unregisters relay %s at tx %s', params._addr, transaction.txHash);
      relayMap.delete(params._addr);
    }
  }
}

module.exports = {
  handleRelayAction
};
