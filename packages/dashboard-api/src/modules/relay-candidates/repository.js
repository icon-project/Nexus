'use strict';

const { logger, pgPool } = require('../../common');

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

async function getRelayCandidateList() {
  const query = `SELECT relay_candidates.*, sum(reward_value) as monthly_reward FROM relay_candidates
                    INNER JOIN relay_rewards ON relay_candidates.id = relay_rewards.relay_id
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
          monthlyReward: Number(row.monthly_reward),
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
async function getRelayCAND30DaysAgo() {
  const time24hAgo = new Date(new Date().getTime() - 86400000 * 30);
  const query = `SELECT relay_candidates.id, name, sum(reward_value) as monthly_reward FROM relay_candidates
                    INNER JOIN relay_rewards ON relay_candidates.id = relay_rewards.relay_id
                  WHERE unregistered_time IS NULL AND relay_rewards.created_time <= $1
                  GROUP BY (relay_candidates.id)`;
  try {
    const { rows } = await pgPool.query(query, [time24hAgo.toISOString()]);

    if (rows.length > 0) {
      const relayCandidates = [];

      for (const row of rows) {
        relayCandidates.push({
          id: row.id,
          name: row.name,
          monthlyReward: Number(row.monthly_reward),
        });
      }
      return relayCandidates;
    }
  } catch (error) {
    logger.error('getRelayCAND30DaysAgo fails', { error });
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
  countTotalRelayCandidates,
  getRelayCandidateList,
  getTotalBondedRelayCandidates,
  getById,
  getRelayCAND30DaysAgo,
};
