'use strict';
const { TRANSACTION_TBL_NAME } = require('../../../../block-indexer/src/common');
const { pgPool, NETWORK_TBL_NAME, TRANSACTION_TBL } = require('../../common');

async function countNetwork() {
  const {
    rows: [result],
  } = await pgPool.query(`SELECT COUNT(*) FROM ${NETWORK_TBL_NAME}`);
  return Number(result.count) || 0;
}

async function sumTransactionAmount() {
  const {
    rows: [result],
  } = await pgPool.query(
    `SELECT SUM(value) FROM ${TRANSACTION_TBL_NAME} WHERE ${TRANSACTION_TBL.confirmed} = true AND ${TRANSACTION_TBL.deleteAt} = 0`,
  );
  return Number(result.sum) || 0;
}

async function countTransaction() {
  const {
    rows: [result],
  } = await pgPool.query(
    `SELECT COUNT(*) FROM ${TRANSACTION_TBL_NAME} WHERE ${TRANSACTION_TBL.confirmed} = true AND ${TRANSACTION_TBL.deleteAt} = 0`,
  );
  return Number(result.count) || 0;
}

async function getAllTimeFeeOfAssets() {
  const query = 'SELECT token_name, SUM(token_amount) AS total_token_amount FROM transfer_fees GROUP BY token_name';

  try {
    const { rows } = await pgPool.query(query);
    const assets = [];

    if (rows.length > 0) {
      for (const row of rows) {
        assets.push({
          name: row.token_name,
          value: row.total_token_amount
        });
      }
    }

    return assets;
  } catch (error) {
    logger.error('getAllTimeFeeOfAssets fails', { error });
    throw error;
  }
}

module.exports = {
  countNetwork,
  sumTransactionAmount,
  countTransaction,
  getAllTimeFeeOfAssets
};
