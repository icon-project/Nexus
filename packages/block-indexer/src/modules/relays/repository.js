/* eslint-disable prefer-const */
'use strict';

const { pgPool, createLogger } = require('../../common');

const logger = createLogger();

async function createRelay(relay) {
  try {
    await pgPool.query(
      'INSERT INTO relays (tx_hash, address, link, server_status, registered_time) VALUES ($1, $2, $3, $4, $5)',
      [relay.txHash, relay.address, relay.link, relay.serverStatus, relay.registeredTime]
    );

    return true;
  } catch (error) {
    logger.error('createRelay Failed save relay %O', error);
  }
}

async function updateRelay(relay) {
  let params = [relay.address, relay.serverStatus, relay.unregisteredTime];
  let query = 'UPDATE relays SET updated_at = NOW(), server_status = $2, unregistered_time = $3';

  if (relay.registeredTime) {
    query += `, registered_time = $${params.length + 1}`;
    params.push(relay.registeredTime);
  }

  const whereCondition = ' WHERE address = $1';

  query += whereCondition;

  try {
    await pgPool.query(query, params);
  } catch (error) {
    logger.error('updateRelay Failed Update Relay', { error });
  }
}

async function setRelayUnregistered(relay) {
  const query = 'UPDATE relays SET updated_at = NOW(), server_status = $2, unregistered_time = $3  WHERE address = $1';
  const params = [relay.address, relay.serverStatus, relay.unregisteredTime];

  try {
    await pgPool.query(query, params);
    return true;
  } catch (error) {
    logger.error('setRelayUnregistered fails %O', error);
  }
}

async function getRelayByAddress(address) {
  try {
    const { rows } = await pgPool.query('SELECT address FROM relays WHERE address = $1', [
      address
    ]);

    if (rows[0]) {
      return rows[0];
    }
  } catch (error) {
    logger.error('getRelayByAddress fails', { error });
  }
}

async function updateRelayTransaction(address, status) {
  let query = 'UPDATE relays SET updated_at = NOW()';

  if (status === 1) {
    query += ', total_transferred_tx = total_transferred_tx + 1';
  } else {
    query += ', total_failed_tx = total_failed_tx + 1';
  }

  query += ' WHERE address = $1 ';

  try {
    await pgPool.query(query, [address]);
  } catch (error) {
    logger.error('updateRelayTransaction fails', { error });
  }
}

async function getRelayAddresses() {
  try {
    const { rows } = await pgPool.query('SELECT address FROM relays WHERE unregistered_time IS NULL ORDER BY registered_time DESC');
    return rows.map(row => row.address);
  } catch (error) {
    logger.error('getRelayAddresses fails', { error });
  }
}

module.exports = {
  getRelayByAddress,
  updateRelay,
  createRelay,
  getRelayAddresses,
  updateRelayTransaction,
  setRelayUnregistered
};
