'use strict';

const { logger, pgPool } = require('../../common');

async function getTotalReward() {
  try {
    const { rows } = await pgPool.query('SELECT total_reward FROM relay_candidate_rewards ORDER BY created_time DESC LIMIT 1');
    return rows[0].total_reward ? Number(rows[0].total_reward) : 0;
  } catch (error) {
    logger.error('getTotalReward fails', { error });
    throw error;
  }
}

async function getTotalRewardLast30Days() {
  const timeToCompare = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000); // 30 days before

  try {
    const { rows } = await pgPool.query(
      'SELECT total_reward FROM relay_candidate_rewards WHERE created_time <= $1 ORDER BY created_time DESC LIMIT 1',
      [timeToCompare.toISOString()]
    );

    return rows[0].total_reward ? Number(rows[0].total_reward) : 0;
  } catch (error) {
    logger.error('getTotalRewardLast30Days fails', { error });
    throw error;
  }
}

async function getRelayCandidateList() {
  const query = `SELECT relay_candidates.*, sum(relay_candidate_rewards.reward_value) as monthly_reward FROM relay_candidates
                  INNER JOIN relay_candidate_rewards ON relay_candidates.id = relay_candidate_rewards.rc_id
                  WHERE unregistered_time IS NULL
                  GROUP BY (relay_candidates.id)`;

  try {
    const { rows } = await pgPool.query(query);

    if (rows.length > 0) {
      const relayCandidates = [];

      for (const row of rows) {
        relayCandidates.push({
          id: row.id,
          rank: Number(row.rank),
          name: row.name,
          bondedICX: Number(row.bonded_icx),
          monthlyReward: row.monthly_reward ? Number(row.monthly_reward) : 0
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
        rank: Number(row.rank),
        name: row.name,
        bondedICX: Number(row.bonded_icx),
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
  getTotalRewardLast30Days
};
