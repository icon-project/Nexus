'use strict';

const debug = require('debug')('db');
const { logger, pgPool } = require('../../common');

async function countTotalRelay() {
  const query = 'SELECT COUNT(*) FROM relays';

  try {
    const { rows } = await pgPool.query(query);
    return Number(rows[0].count);
  } catch (error) {
    logger.error(`countTotalRelay fails`, { error });
    throw error;
  }
}

module.exports = {
  countTotalRelay
};
