const { v4: uuidv4 } = require('uuid');
const { logger } = require('../../common');
const { updateRelay, createRelay, getRelayByAddress } = require('./repository');

const ADD_RELAY_PROTOTYPE = 'addRelay';
const REMOVE_RELAY_PROTOTYPE = 'removeRelay';

async function handleRelayAction(txResult, transaction) {
  let transData = transaction.data;
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
        logger.debug('Create new a relay');
      }
    } else if (REMOVE_RELAY_PROTOTYPE == transData.method) {
      let params = transData.params;
      await updateRelay({
        address: params._addr,
        unregisteredTime: new Date(transaction.timestamp / 1000),
        serverStatus: 'Inactive',
      });
    }
  }
}

module.exports = {
  handleRelayAction,
};
