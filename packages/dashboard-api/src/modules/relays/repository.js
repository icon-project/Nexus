'use strict';

const { logger, pgPool } = require('../../common');

async function countTotalRelay() {
  const query = 'SELECT COUNT(*) FROM relay_candidates WHERE unregistered_time IS NULL';

  try {
    const { rows } = await pgPool.query(query);
    return Number(rows[0].count);
  } catch (error) {
    logger.error('countTotalRelay fails', { error });
    throw error;
  }
}

async function getRelayDetailList() {
  const query = `SELECT relay_candidates.*, sum(reward_value) as monthly_reward FROM relay_candidates
                    INNER JOIN relay_rewards ON relay_candidates.id = relay_rewards.relay_id
                  WHERE unregistered_time IS NULL
                  GROUP BY (relay_candidates.id)`;

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
          monthlyReward: Number(row.monthly_reward),
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
async function getRelayReward30DaysAgo() {
  const time24hAgo = new Date(new Date().getTime() - 86400000 * 30);
  const query = `SELECT relay_candidates.id, name, sum(reward_value) as monthly_reward FROM relay_candidates
                    INNER JOIN relay_rewards ON relay_candidates.id = relay_rewards.relay_id
                  WHERE unregistered_time IS NULL AND relay_rewards.created_time <= $1
                  GROUP BY (relay_candidates.id)`;
  try {
    const { rows } = await pgPool.query(query, [time24hAgo.toISOString()]);

    if (rows.length > 0) {
      const relays = [];

      for (const row of rows) {
        relays.push({
          id: row.id,
          name: row.name,
          monthlyReward: Number(row.monthly_reward),
        });
      }
      return relays;
    }
  } catch (error) {
    logger.error('getRelayReward24hAgo fails', { error });
    throw error;
  }

  return [];
}

async function getTotalBondedRelays() {
  const query = 'SELECT SUM(bonded_icx) FROM relay_candidates WHERE unregistered_time IS NULL';

  try {
    const {
      rows: [result],
    } = await pgPool.query(query);
    return Number(result.sum) || 0;
  } catch (err) {
    logger.error('getTotalBondedRelays fails', { err });
    throw err;
  }
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
      'SELECT total_active, registered_time FROM relay_candidates ORDER BY registered_time DESC LIMIT 1',
    );

    if (0 === result.rows.length) return null;

    const currentCount = Number(result.rows[0].total_active);
    const currentTime = new Date(result.rows[0].registered_time);
    const timeToCompare = new Date(currentTime.getTime() - timeRange);

    result = await pgPool.query(
      'SELECT total_active, registered_time FROM relay_candidates WHERE registered_time <= $1 ORDER BY registered_time DESC LIMIT 1',
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
  getTotalBondedRelays,
  getById,
  getRegisteredRelayChange,
  getRelayReward30DaysAgo,
};
