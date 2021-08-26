'use strict';

const debug = require('debug')('icon');
const { logger, pgPool, hexToFixedAmount } = require('../../common');
const { v4: uuidv4 } = require('uuid');

const REGISTER_RELAYER_PROTOTYPE = 'registerRelayer';
const UNREGISTER_RELAYER_PROTOTYPE = 'unregisterRelayer';

async function handleRelayerAction(txResult, transaction) {
  let transData = transaction.data;

  if (transData && 1 === txResult.status) {
    if (REGISTER_RELAYER_PROTOTYPE === transData.method) {
      const relayer = {
        id: uuidv4(),
        address: transaction.from,
        destAddress: transaction.to,
        registerTime: new Date(transaction.timestamp / 1000),
        unregisteredTime: null,
        bondedICX: hexToFixedAmount(transaction.value.c[0]),
        name: transData.params._desc,
      };
      await saveRelayer(relayer, txResult);
    } else if (UNREGISTER_RELAYER_PROTOTYPE === transData.method) {
      const relayer = {
        address: transaction.from,
        unregisteredTime: new Date(transaction.timestamp / 1000),
      };
      await unregisterRelayer(relayer, txResult);
    }
  }
}

async function saveRelayer(relayer) {
  try {
    const query = `INSERT INTO relay_candidates (
        id,
        rank,
        name,
        address,
        dest_address,
        bonded_icx,
        registered_time,
        unregistered_time,
        created_time,
        updated_time) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW())
      ON CONFLICT (address)
      DO
        UPDATE SET
          rank = $2
          dest_address = $5,
          bonded_icx = $6,
          registered_time = $7,
          unregistered_time = $8,
          updated_time = NOW()`;
    const values = [
      relayer.id,
      null,
      relayer.name,
      relayer.address,
      relayer.destAddress,
      relayer.bondedICX,
      relayer.registerTime,
      relayer.unregisterTime,
    ];

    await pgPool.query(query, values);
  } catch (error) {
    logger.error('saveRelayerInfo failed ', { error });
  }
}

async function unregisterRelayer(relayer) {
  try {
    const query = `
      UPDATE SET
        unregistered_time = $1,
        updated_time = NOW()
      WHERE
        address = $2`;
    await pgPool.query(query, [relayer.unregisteredTime, relayer.address]);
  } catch (error) {
    logger.error('unregisterRelayer failed', { error });
  }
}

module.exports = {
  handleRelayerAction,
};
