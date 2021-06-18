'use strict';

const { logger, pgPool, TRANSACTION_TBL_NAME } = require('../../common');

async function getTransactions(page = 0, limit = 20) {
  let offset = page * limit;
  const query = `SELECT * FROM ${TRANSACTION_TBL_NAME} LIMIT ${limit} OFFSET ${offset}`;

  try {
    const { rows } = await pgPool.query(query);
    return rows;
  } catch (error) {
    logger.error('getHistories fails', { error });
    throw error;
  }
}

module.exports = {
  getTransactions,
};
