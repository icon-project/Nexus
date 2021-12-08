'use strict';

const debug = require('debug')('icon_tx');
const { createLogger, hexToFixedAmount } = require('../../common');
const { registerRelayer, unregisterRelayer } = require('./repository');

const REGISTER_RELAYER_PROTOTYPE = 'registerRelayer';
const UNREGISTER_RELAYER_PROTOTYPE = 'unregisterRelayer';
const logger = createLogger();

async function handleRelayerAction(transaction) {
  const data = transaction.data;

  if (data && data.method) {
    if (REGISTER_RELAYER_PROTOTYPE === data.method) {
      const relayer = {
        name: data.params._desc,
        address: transaction.from,
        bondedIcx: hexToFixedAmount(transaction.value),
        registeredTime: new Date(transaction.timestamp / 1000),
        txHash: transaction.txHash
      };

      logger.info('icon:registerRelayer %O', relayer);
      await registerRelayer(relayer);
    } else if (UNREGISTER_RELAYER_PROTOTYPE === data.method) {
      const relayer = {
        address: transaction.from,
        unregisteredTime: new Date(transaction.timestamp / 1000),
        txHash: transaction.txHash
      };

      logger.info('icon:unregisterRelayer %O', relayer);
      await unregisterRelayer(relayer);
    }
  }
}

module.exports = {
  handleRelayerAction
};
