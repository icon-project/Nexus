'use strict';
const { logger, pgPool } = require('../../common');

async function getTransactionIP(txHash, networkId) {
  const query = 'SELECT * FROM transaction_ips WHERE tx_hash = $1 AND network_id = $2';
  try {
    const { rows } = await pgPool.query(query, [txHash, networkId]);
    if (rows.length > 0) {
      const row = rows[0];
      return {
        ip: row.ip,
        sentToSlack: row.sent_to_slack
      };
    }
    return null;
  } catch (error) {
    logger.error(error);
    return null;
  }
}

async function updateTransactionIP(txHash, networkId, sentToSlack, data) {
  const query = 'UPDATE transaction_ips SET sent_to_slack = $1, data = $2 WHERE tx_hash = $3 AND network_id = $4';
  try {
    const { rows } = await pgPool.query(query, [sentToSlack, data, txHash, networkId]);
    if (rows.length > 0) {
      return rows[0].ip;
    }
    return null;
  } catch (error) {
    logger.error(error);
    return null;
  }
}

async function createTransactionIP(txHash, networkId, sentToSlack, data) {
  const query = 'INSERT INTO transaction_ips(tx_hash, network_id, sent_to_slack, data) VALUES($1, $2, $3, $4)';
  try {
    const { rows } = await pgPool.query(query, [txHash, networkId, sentToSlack, data]);
    if (rows.length > 0) {
      return rows[0].ip;
    }
    return null;
  } catch (error) {
    logger.error(error);
    return null;
  }
}

module.exports = {
  getTransactionIP,
  updateTransactionIP,
  createTransactionIP
};
