'use strict';
const { logger, pgPool } = require('../../common');

async function getTransactionIP(txHash, networkId) {
  const query = 'SELECT * FROM transaction_ips WHERE tx_hash = $1 AND network_id = $2';
  try {
    const { rows } = await pgPool.query(query, [txHash, networkId]);
    if (rows.length > 0) {
      return rows[0].ip;
    }
    return null;
  } catch (error) {
    logger.info(error);
    return null;
  }
}

module.exports = {
  getTransactionIP
};
