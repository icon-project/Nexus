'use strict';
const { TRANSACTION_TBL_NAME } = require('../../../../block-indexer/src/common');
const { pgPool, NETWORK_TBL_NAME, TRANSACTION_TBL } = require('../../common');

async function countNetwork() {
  const {
    rows: [result],
  } = await pgPool.query(`SELECT COUNT(*) FROM ${NETWORK_TBL_NAME}`);
  return result.count;
}

async function sumTransactionAmount() {
  const {
    rows: [result],
  } = await pgPool.query(
    `SELECT SUM(value) FROM ${TRANSACTION_TBL_NAME} WHERE ${TRANSACTION_TBL.confirmed} = true`,
  );
  return result.sum;
}

module.exports = {
  countNetwork,
  sumTransactionAmount,
};
