'use strict';

const debug = require('debug')('db');
const { logger, pgPool } = require('../../common');

async function countTotalRelay() {
  const query = 'SELECT COUNT(*) FROM relays';

  try {
    const { rows } = await pgPool.query(query);
    return Number(rows[0].count);
  } catch (error) {
    logger.error('countTotalRelay fails', { error });
    throw error;
  }
}

async function getRelayDetailList() {
  const query = 'SELECT * FROM relays';

  try {
    const { rows } = await pgPool.query(query);

    if (rows.length > 0) {
      const relays = [];

      for (const row of rows) {
        relays.push({
          id: row.id,
          rank: Number(row.rank),
          name: row.name,
          bondedICX: Number(row.bonded_icx),
          serverStatus: Number(row.server_status),
          transferredTransactions: Number(row.total_transferred_tx),
          failedTransactions: Number(row.total_failed_tx),
        });
      }

      return relays;
    }
  } catch (error) {
    logger.error('getRelayList fails', { error });
    throw error;
  }

  return [];
}

async function getTotalBondedRelays() {
  const query = 'SELECT name, bonded_icx as volume FROM relays';

  try {
    const { rows } = await pgPool.query(query);
    if (rows.length > 0) {
      const bondedRelays = [];

      for (const row of rows) {
        bondedRelays.push({
          relayName: row.name,
          volume: Number(row.volume),
        });
      }
      return bondedRelays;
    }
  } catch (err) {
    logger.error('getTotalBondedRelays fails', { err });
    throw err;
  }
}
async function getById(id) {
  const query = 'SELECT * FROM relays WHERE id = $1 LIMIT 1';

  try {
    const { rows } = await pgPool.query(query, [id]);
    if (rows.length > 0) {
      const row = rows[0];
      const result = {
        id: row.id,
        rank: Number(row.rank),
        name: row.name,
        bondedICX: Number(row.bonded_icx),
        serverStatus: Number(row.server_status),
        transferredTransactions: Number(row.total_transferred_tx),
        failedTransactions: Number(row.total_failed_tx),
      };
      return result;
    }
    return {};
  } catch (err) {
    logger.error('getById fails', { err });
    throw err;
  }
}

module.exports = {
  countTotalRelay,
  getRelayDetailList,
  getTotalBondedRelays,
  getById,
};
