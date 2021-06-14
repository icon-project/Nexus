'use strict';
const { TRANSACTION_TBL_NAME } = require('../../../../block-indexer/src/common');
const { pgPool, NETWORK_TBL_NAME, TRANSACTION_TBL, NETWORKS_CONNECTED_ICON_TBL_NAME } = require('../../common');

async function countNetwork() {
  const {
    rows: [result],
  } = await pgPool.query(`SELECT COUNT(*) FROM ${NETWORK_TBL_NAME}`);
  return result.count || 0;
}

async function sumTransactionAmount() {
  const {
    rows: [result],
  } = await pgPool.query(
    `SELECT SUM(value) FROM ${TRANSACTION_TBL_NAME} WHERE ${TRANSACTION_TBL.confirmed} = true AND ${TRANSACTION_TBL.deleteAt} = 0`,
  );
  return result.sum || 0;
}

async function countTransaction() {
  const {
    rows: [result],
  } = await pgPool.query(
    `SELECT COUNT(*) FROM ${TRANSACTION_TBL_NAME} WHERE ${TRANSACTION_TBL.confirmed} = true AND ${TRANSACTION_TBL.deleteAt} = 0`,
  );
  return result.count || 0;
}


async function getNetworkConnectedIcon() {
  const {rows} = await pgPool.query(
    `SELECT * FROM ${NETWORKS_CONNECTED_ICON_TBL_NAME}`,
  );
  return rows;
}


module.exports = {
  countNetwork,
  sumTransactionAmount,
  countTransaction,
  getNetworkConnectedIcon
};
