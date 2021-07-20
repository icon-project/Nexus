'use strict';
const { pgPool, logger, NETWORK_TBL_NAME, TRANSACTION_TBL, TRANSACTION_TBL_NAME } = require('../../common');

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
    `SELECT SUM(value) FROM ${TRANSACTION_TBL_NAME} WHERE ${TRANSACTION_TBL.status} = 1 AND ${TRANSACTION_TBL.deleteAt} = 0`,
  );
  return Number(result.sum) || 0;
}

async function countTransaction() {
  const {
    rows: [result],
  } = await pgPool.query(
    `SELECT COUNT(*) FROM ${TRANSACTION_TBL_NAME} WHERE ${TRANSACTION_TBL.status} = 1 AND ${TRANSACTION_TBL.deleteAt} = 0`,
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
          value: Number(row.total_token_amount)
        });
      }
    }

    return assets;
  } catch (error) {
    logger.error('getAllTimeFeeOfAssets fails', { error });
    throw error;
  }
}

async function getVolumeMintedNetworks() {
  const query = 'SELECT network_id, token_name,  SUM(token_value) AS token_volume FROM minted_tokens GROUP BY(network_id, token_name)';

  try {
    const { rows } = await pgPool.query(query);
    let results = [];

    if (rows.length > 0) {
      for (let row of rows) {
        results.push({
          networkId: row.network_id,
          tokenName: row.token_name,
          tokenVolume: row.token_volume,
        });
      }
    }

    return results;
  } catch (error) {
    logger.error('getVolumeMintedNetworks fails', { error });
    throw error;
  }
}

async function getLatestTokensMinted() {
  try {
    let results = await pgPool.query(`SELECT DISTINCT ON (token_name) token_name, total_token_amount
      FROM minted_tokens
      ORDER BY token_name, create_at DESC`);

    if (0 === results.rows.length)
      return null;

    return results.rows.map(row => ({
      tokenName: row.token_name,
      tokenAmount: row.total_token_amount,
    }));
  } catch (error) {
    logger.error('getTotalUSDMinted fails', { error });
    throw error;
  }
}

async function getTotalTokensMintedLast24h() {
  try {
    const at24hAgo = new Date(Date.now()  - (24 * 60 * 60 * 1000)); // millisecond 

    let results = await pgPool.query(`SELECT DISTINCT ON (token_name) token_name, total_token_amount
    FROM minted_tokens
    WHERE create_at <= $1
    ORDER BY token_name, create_at DESC`, [at24hAgo.toISOString()]);

    if (0 === results.rows.length)
      return null;

    return results.rows.map(row => ({
      tokenName: row.token_name,
      tokenAmount: row.total_token_amount,
    }));
  } catch (error) {
    logger.error('getTotalUSDMintedLast24h fails', { error });
    throw error;
  }
}

module.exports = {
  countNetwork,
  sumTransactionAmount,
  countTransaction,
  getAllTimeFeeOfAssets,
  getVolumeMintedNetworks,
  getLatestTokensMinted,
  getTotalTokensMintedLast24h
};
