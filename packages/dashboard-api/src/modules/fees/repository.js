'use strict';

const { logger, pgPool } = require('../../common');

// timeRange in milliseconds
async function getAvailableFeeChange(timeRange) {
  try {
    let result = await pgPool.query('SELECT total_fee_usd, created_time FROM transfer_fees ORDER BY created_time DESC LIMIT 1');

    if (0 === result.rows.length)
      return null;

    const currentFee = Number(result.rows[0].total_fee_usd);
    const currentTime = new Date(result.rows[0].created_time);
    const compareToTime = new Date(currentTime.getTime() - timeRange);

    result = await pgPool.query('SELECT total_fee_usd, created_time FROM transfer_fees WHERE created_time <= $1 ORDER BY created_time DESC LIMIT 1', [compareToTime.toISOString()]);

    if (0 === result.rows.length)
      return null;

    const comparedFee = Number(result.rows[0].total_fee_usd);
    const comparedTime = new Date(result.rows[0].created_time);

    return {
      currentFee,
      currentTime,
      comparedFee,
      comparedTime
    };
  } catch (error) {
    logger.error(`getAvailableFeeChange fails`, { error });
    throw error;
  }
}

module.exports = {
  getAvailableFeeChange
};
