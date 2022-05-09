'use strict';
const { logger, pgPool } = require('../../common');

async function insertTransactionIP(txHash, ip, networkId, sentToSlack) {
  const query = 'INSERT INTO transaction_ips (tx_hash, ip, network_id, sent_to_slack) VALUES ($1, $2, $3, $4) RETURNING tx_hash, ip, network_id, sent_to_slack';
  try {
    const { rows } = await pgPool.query(query, [txHash, ip, networkId, sentToSlack]);
    if (rows.length > 0) {
      const record = rows[0];
      return {
        txHash: record.tx_hash,
        ip: record.ip,
        sentToSlack: record.sent_to_slack,
        networkId: record.network_id
      };
    }
    return null;
  } catch (error) {
    logger.error(error);
    return null;
  }
}

async function updateTransactionIP(txHash, networkId, sentToSlack, ip, data) {
  const query = 'UPDATE transaction_ips SET sent_to_slack = $1, ip = $2, data = $3, updated_at = NOW() WHERE tx_hash = $4 AND network_id = $5 RETURNING tx_hash, ip, network_id, sent_to_slack';
  try {
    const { rows } = await pgPool.query(query, [sentToSlack, ip, data, txHash, networkId]);
    if (rows.length > 0) {
      const record = rows[0];
      return {
        ip: record.ip,
        networkId: record.network_id,
        txHash: record.tx_hash,
        sentToSlack: record.sent_to_slack
      };
    }
    return null;
  } catch (error) {
    logger.error(error);
    return null;
  }
}

async function getTransactionIP(txHash, networkID) {
  const query = `SELECT tx_hash, ip, network_id, sent_to_slack, data
                FROM transaction_ips
                WHERE transaction_ips.tx_hash = $1
                  AND transaction_ips.network_id = $2;`;
  try {
    const { rows } = await pgPool.query(query, [txHash, networkID]);
    if (rows.length > 0) {
      const record = rows[0];
      return {
        txHash: record.tx_hash,
        ip: record.ip,
        sentToSlack: record.sent_to_slack,
        data: record.data
      };
    }
    return null;
  } catch (error) {
    logger.error(error);
    return null;
  }
}

module.exports = {
  insertTransactionIP,
  getTransactionIP,
  updateTransactionIP
};
