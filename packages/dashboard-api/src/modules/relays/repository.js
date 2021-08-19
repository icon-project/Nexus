'use strict';

const { logger, pgPool } = require('../../common');

async function countTotalRelay() {
  const query = 'SELECT COUNT(*) FROM relays WHERE unregistered_time IS NULL';

  try {
    const { rows } = await pgPool.query(query);
    return Number(rows[0].count);
  } catch (error) {
    logger.error('countTotalRelay fails', { error });
    throw error;
  }
}

async function getRelayDetailList(page = 0, limit = 20) {
  const query = `SELECT
                    id, address,server_status, total_transferred_tx, total_failed_tx
                  FROM relays
                    WHERE unregistered_time IS NULL
                    LIMIT $1 OFFSET $2`;

  let offset = page * limit;

  try {
    const { rows } = await pgPool.query(query, [limit, offset]);

    if (rows.length > 0) {
      const relays = [];

      for (const row of rows) {
        relays.push({
          id: row.id,
          address: row.address,
          serverStatus: row.server_status,
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

async function getById(id) {
  const query = 'SELECT * FROM relay_candidates WHERE id = $1';

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

// timeRange in milliseconds
async function getRegisteredRelayChange(timeRange) {
  try {
    let result = await pgPool.query(
      'SELECT count(*) as total_active FROM relays WHERE unregistered_time IS NULL',
    );

    if (0 === result.rows.length) return null;

    const currentCount = Number(result.rows[0].total_active);
    const currentTime = new Date();
    const timeToCompare = new Date(currentTime.getTime() - timeRange);

    result = await pgPool.query(
      'SELECT count(*) as total_active FROM relays WHERE registered_time <= $1 AND unregistered_time IS NULL',
      [timeToCompare.toISOString()],
    );

    if (0 === result.rows.length) return null;

    const comparedCount = Number(result.rows[0].total_active);
    const comparedTime = new Date(result.rows[0].registered_time);

    return {
      currentCount,
      currentTime,
      comparedCount,
      comparedTime,
    };
  } catch (error) {
    logger.error('getRegisteredRelayChange fails', { error });
    throw error;
  }
}

module.exports = {
  countTotalRelay,
  getRelayDetailList,
  getById,
  getRegisteredRelayChange,
};
