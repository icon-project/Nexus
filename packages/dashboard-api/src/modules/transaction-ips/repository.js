'use strict';
const { logger, pgPool } = require('../../common');

async function createTransactionIP(txHash, ip, networkID) {
  const query = 'INSERT INTO transaction_ips (tx_hash, ip, network_id) VALUES ($1, $2, $3) RETURNING tx_hash, ip';
  try {
    const { rows } = await pgPool.query(query, [txHash, ip, networkID]);
    if (rows.length > 0) {
      const record = rows[0];
      return {
        txHash: record.tx_hash,
        ip: record.ip
      };
    }
    return null;
  } catch (error) {
    logger.error(error);
    return null;
  }
}

async function getTransactionIP(txHash, ip, networkID) {
  const query = `SELECT tx_hash, ip, network_id, created_at, updated_at
                FROM transaction_ips
                WHERE transaction_ips.tx_hash = $1
                  AND transaction_ips.network_id = $2;`;
  try {
    const { rows } = await pgPool.query(query, [txHash, networkID]);
    if (rows.length > 0) {
      const record = rows[0];
      return {
        txHash: record.tx_hash,
        ip: record.ip
      };
    }
    return null;
  } catch (error) {
    logger.error(error);
    return null;
  }
}

module.exports = {
  createTransactionIP,
  getTransactionIP
};
