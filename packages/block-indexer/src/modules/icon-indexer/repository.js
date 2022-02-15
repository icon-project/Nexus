'use strict';

const { pgPool, createLogger } = require('../../common');

const logger = createLogger();

async function registerRelayer(relayer) {
  try {
    const query = 'INSERT INTO relay_candidates (tx_hash, name, address, bonded_icx, registered_time) VALUES ($1, $2, $3, $4, $5)';
    const values = [relayer.txHash, relayer.name, relayer.address, relayer.bondedIcx, relayer.registeredTime];
    await pgPool.query(query, values);
  } catch (error) {
    logger.error('registerRelayer fails: %s, %s', error.message, error.detail);
  }
}

async function unregisterRelayer(relayer) {
  try {
    const query = 'UPDATE relay_candidates SET unregistered_time=$1, tx_hash_unregistered=$2, updated_time=NOW() WHERE address=$3';
    await pgPool.query(query, [relayer.unregisteredTime, relayer.txHash, relayer.address]);
  } catch (error) {
    logger.error('unregisterRelayer fails: %s, %s', error.message, error.detail);
  }
}

module.exports = {
  registerRelayer,
  unregisterRelayer
};
