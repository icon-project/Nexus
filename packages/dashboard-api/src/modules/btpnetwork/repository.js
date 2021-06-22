'use strict';
const { pgPool, NETWORK_TBL_NAME, TRANSACTION_TBL, TRANSACTION_TBL_NAME} = require('../../common');

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

module.exports = {
  countNetwork,
  sumTransactionAmount,
  countTransaction
};
