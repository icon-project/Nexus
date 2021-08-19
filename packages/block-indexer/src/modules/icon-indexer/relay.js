const { v4: uuidv4 } = require('uuid');
const { pgPool, logger } = require('../../common');

const ADD_RELAY_PROTOTYPE = 'addRelay';
const REMOVE_RELAY_PROTOTYPE = 'removeRelay';

async function handleRelayAction(txResult, transaction) {
  let transData = transaction.data;
  if (txResult.status == 1 && ADD_RELAY_PROTOTYPE == transData.method) {
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
      logger.debug('Regist the relay again');
    } else {
      await createRelay(relay);
      logger.debug('Create new a relay');
    }
  } else if (txResult.status == 1 && REMOVE_RELAY_PROTOTYPE == transData.method) {
    let params = transData.params;
    await updateRelay({
      address: params._addr,
      unregisteredTime: new Date(transaction.timestamp / 1000),
      serverStatus: 'Inactive',
    });
  }
}

async function createRelay(relay) {
  try {
    await pgPool.query(
      `INSERT INTO relays(
     id,
     address,
     link,
     server_status,
     total_transferred_tx,
     total_failed_tx,
     registered_time,
     unregistered_time,
     created_at,
     updated_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW())`,
      [
        relay.id,
        relay.address,
        relay.link,
        relay.serverStatus,
        0,
        0,
        relay.registeredTime,
        relay.unregisteredTime,
      ],
    );
    logger.info('SQL statement insert Relay success');
  } catch (error) {
    logger.error('createRelay Failed save Relay', { error });
  }
}

async function updateRelay(relay) {
  let params = [relay.address, relay.serverStatus];
  let query = `UPDATE relays
    SET
      updated_at = NOW(),
      server_status = $2
    `;

  if (relay.unregisteredTime) {
    query += `, unregistered_time = $${params.length + 1}`;
    params.push(relay.unregisteredTime);
  }
  if (relay.registeredTime) {
    query += `, registered_time = $${params.length + 1}`;
    params.push(relay.registeredTime);
  }

  const whereCondition = ' WHERE address = $1';

  query += whereCondition;
  try {
    await pgPool.query(query, params);
    logger.info('SQL statement update Relay success:');
  } catch (error) {
    logger.error('updateRelay Failed Update Relay', { error });
  }
}

async function getRelayByAddress(address) {
  try {
    const { rows } = await pgPool.query(
      `
    SELECT id, address
      FROM relays
      WHERE address = $1`,
      [address],
    );

    if (rows[0]) {
      return rows[0];
    }
  } catch (error) {
    logger.error('getRelayByAddress Failed Delete Relay', { error });
  }
}

module.exports = {
  handleRelayAction,
};
