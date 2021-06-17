'use strict';
const { pgPool, NETWORK_TBL_NAME, TRANSACTION_TBL, NETWORKS_CONNECTED_ICON_TBL_NAME, TRANSACTION_TBL_NAME} = require('../../common');

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

async function getNetworkInfo() {
  const {rows} = await pgPool.query(
    `SELECT * FROM ${NETWORK_TBL_NAME}`,
  );
  return rows;
}

async function getTokensVolume24h() {
  const _24hours_ago = (new Date().getTime()*1000) - 86400000000;
  const {rows} = await pgPool.query(
    `SELECT nid, token_name, sum(value) as total_token
     FROM ${TRANSACTION_TBL_NAME}
     WHERE timestamp >= ${_24hours_ago}
     GROUP BY(token_name, nid)`,
  );
  return rows;
}

async function getTokenVolumeAllTime() {
  const {rows} = await pgPool.query(
    `SELECT nid, token_name, sum(value) as total_token
     FROM ${TRANSACTION_TBL_NAME}
     GROUP BY(token_name, nid)`,
  );
  return rows;
}

module.exports = {
  countNetwork,
  sumTransactionAmount,
  countTransaction,
  getNetworkConnectedIcon,
  getNetworkInfo,
  getTokensVolume24h,
  getTokenVolumeAllTime,
};
