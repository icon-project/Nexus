'use strict';
const { createLogger, pgPool } = require('../../common');
const logger = createLogger();
const RETURNING_FIELDS = 'RETURNING tx_hash, ip, network_id, sent_to_slack, data';

function parseTransactionIP(row) {
  const record = row || {};
  return {
    txHash: record.tx_hash,
    ip: record.ip,
    networkId: record.network_id,
    sentToSlack: record.sent_to_slack,
    data: record.data
  };
}

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
  const query = 'UPDATE transaction_ips SET sent_to_slack = $1, data = $2 WHERE tx_hash = $3 AND network_id = $4 ' + RETURNING_FIELDS;
  try {
    const { rows } = await pgPool.query(query, [sentToSlack, data, txHash, networkId]);
    if (rows.length > 0) {
      return parseTransactionIP(rows[0]);
    }
    return null;
  } catch (error) {
    logger.error(error);
    return null;
  }
}

async function createTransactionIP(txHash, networkId, sentToSlack, data) {
  const query = 'INSERT INTO transaction_ips(tx_hash, network_id, sent_to_slack, data) VALUES($1, $2, $3, $4) ' + RETURNING_FIELDS;
  try {
    const { rows } = await pgPool.query(query, [txHash, networkId, sentToSlack, data]);
    if (rows.length > 0) {
      return parseTransactionIP(rows[0]);
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
