'use strict';

const { logger, pgPool } = require('../../common');

// timeRange in milliseconds
async function getAvailableFeeChange(timeRange) {
  try {
    const timeToCompare = new Date(Date.now() - timeRange);

    const latestTokens = await pgPool.query(`
      SELECT DISTINCT ON (token_name) token_name, total_token_amount
      FROM transfer_fees
      WHERE created_time >= $1
      ORDER BY token_name, created_time DESC`, [timeToCompare.toISOString()]);

    if (0 === latestTokens.rows.length)
      return null;

    const last24hTokens = await pgPool.query(`
      SELECT DISTINCT ON (token_name) token_name, total_token_amount
      FROM transfer_fees
      WHERE created_time < $1
      ORDER BY token_name, created_time DESC`, [timeToCompare.toISOString()]);

    if (0 === last24hTokens.rows.length)
      return null;

    return {
      latestTokens: latestTokens.rows.map(row => ({
        name: row.token_name,
        value: Number(row.total_token_amount)
      })),
      last24hTokens: last24hTokens.rows.map(row => ({
        name: row.token_name,
        value: Number(row.total_token_amount)
      }))
    };
  } catch (error) {
    logger.error(`getAvailableFeeChange fails`, { error });
    throw error;
  }
}

module.exports = {
  getAvailableFeeChange
};
