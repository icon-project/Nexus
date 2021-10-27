'use strict';

const debug = require('debug')('db');
const { pgPool, logger } = require('../../common');

async function createRelay(relay) {
  try {
    await pgPool.query(
      'INSERT INTO relays (id, address, link, server_status, registered_time, total_transferred_tx, total_failed_tx, created_at) VALUES ($1, $2, $3, $4, $5, 0, 0, NOW())',
      [relay.id, relay.address, relay.link, relay.serverStatus, relay.registeredTime],
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
    const { rows } = await pgPool.query('SELECT id, address FROM relays WHERE address = $1', [
      address,
    ]);

    if (rows[0]) {
      return rows[0];
    }
  } catch (error) {
    logger.error('getRelayByAddress fails', { error });
  }
}

async function updateRelayTransaction(address, transactionStatus) {
  let query = 'UPDATE relays SET updated_at = NOW()';

  if (transactionStatus === 1) {
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
    const { rows } = await pgPool.query('SELECT address FROM relays ORDER BY registered_time DESC');

    if (rows.length > 0) {
      const addesses = rows.map((item) => item.address);
      return addesses;
    }
  } catch (error) {
    logger.error('getRelayAddresses fails', { error });
  }

  return [];
}

module.exports = {
  getRelayByAddress,
  updateRelay,
  createRelay,
  getRelayAddresses,
  updateRelayTransaction,
  setRelayUnregistered
};
