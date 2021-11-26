'use strict';

const { logger, pgPool, hexToFixedAmount, numberToFixedAmount } = require('../../common');

async function countTotalRelayCandidates() {
  const query = 'SELECT COUNT(*) FROM relay_candidates WHERE unregistered_time IS NULL';

  try {
    const { rows } = await pgPool.query(query);
    return Number(rows[0].count);
  } catch (error) {
    logger.error('countTotalRelayCandidates fails', { error });
    throw error;
  }
}

async function getTotalReward() {
  try {
    const { rows } = await pgPool.query(
      'SELECT total_reward, created_at FROM relay_candidate_rewards ORDER BY created_at DESC LIMIT 1',
    );
    return {
      totalReward: rows[0] ? Number(rows[0].total_reward) : 0,
      createdAt: rows[0]? rows[0].created_at : null
    }
  } catch (error) {
    logger.error('getTotalReward fails', { error });
    throw error;
  }
}

async function getTotalRewardLast30Days(lastDate) {
  const timeToCompare = new Date(lastDate.getTime() - 30 * 24 * 60 * 60 * 1000); // 30 days before

  try {
    const {
      rows,
    } = await pgPool.query(
      'SELECT total_reward FROM relay_candidate_rewards WHERE created_at >= $1 AND created_at < $2',
      [timeToCompare.toISOString(), lastDate.toISOString()],
    );
    let total = 0;
    rows.map(row => total += Number(row.total_reward));
    return total;
  } catch (error) {
    logger.error('getTotalRewardLast30Days fails', { error });
    throw error;
  }
}

async function getRelayCandidateList(page = 0, limit = 20) {
  const query = `SELECT relay_candidates.* FROM relay_candidates
                  WHERE unregistered_time IS NULL
                  LIMIT $1 OFFSET $2`;

  let offset = page * limit;

  try {
    const { rows } = await pgPool.query(query, [limit, offset]);

    if (rows.length > 0) {
      const relayCandidates = [];

      for (const row of rows) {
        relayCandidates.push({
          id: row.id,
          rank: Number(row.rank),
          name: row.name,
          address: row.address,
          bondedICX: numberToFixedAmount(Number(row.bonded_icx)),
          monthlyReward: numberToFixedAmount(Number(row.total_reward))
        });
      }

      return relayCandidates;
    }
  } catch (error) {
    logger.error('getRelayCandidateList fails', { error });
    throw error;
  }

  return [];
}

async function getTotalBondedRelayCandidates() {
  const query = 'SELECT SUM(bonded_icx) FROM relay_candidates WHERE unregistered_time IS NULL';

  try {
    const {
      rows: [result],
    } = await pgPool.query(query);
    return Number(result.sum) || 0;
  } catch (err) {
    logger.error('getTotalBondedRelayCandidates fails', { err });
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
        rank: row.rank,
        address: row.address,
        name: row.name,
        bondedICX: hexToFixedAmount(Number(row.bonded_icx)),
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
  getRelayCandidateList,
  getTotalBondedRelayCandidates,
  getById,
  getTotalReward,
  getTotalRewardLast30Days,
  countTotalRelayCandidates,
};
