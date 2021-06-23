'use strict';

const { logger, pgPool, TRANSACTION_TBL_NAME } = require('../../common');

async function getTransactions(page = 0, limit = 20) {
  let offset = page * limit;
  const query = `SELECT * FROM ${TRANSACTION_TBL_NAME} LIMIT ${limit} OFFSET ${offset}`;

  try {
    const { rows } = await pgPool.query(query);
    const transactions = [];
    if (rows.length > 0) {
      for (const row of rows) {
        transactions.push({
          id: row.id,
          serialNumber: row.serial_number,
          tokenName: row.token_name,
          value: Number(row.value),
          toAddress: row.to_address,
          fromAddress: row.from_address,
          blockHeight: row.block_height,
          blockHash: row.block_hash,
          txHash: row.tx_hash,
          confirmed: row.confirmed,
          createAt: Number(row.create_at),
          updateAt: Number(row.update_at),
          deleteAt: Number(row.delete_at),
          nid: row.nid,
          blockTime: Number(row.block_time),
        });
      }
    }
    return transactions;
  } catch (error) {
    logger.error('getHistories fails', { error });
    throw error;
  }
}

module.exports = {
  getTransactions,
};
