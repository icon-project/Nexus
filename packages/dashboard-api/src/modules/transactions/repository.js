'use strict';

const { logger, pgPool, TRANSACTION_TBL_NAME, TRANSACTION_TBL } = require('../../common');

async function getTransactions(page = 0, limit = 20, from, to) {
  let offset = page * limit;
  const query = `SELECT * FROM ${TRANSACTION_TBL_NAME}
                    WHERE ${TRANSACTION_TBL.fromAddress} ~ $1
                       AND ${TRANSACTION_TBL.toAddress} ~ $2
                    LIMIT $3 OFFSET $4`;

  try {
    const { rows } = await pgPool.query(query, [from, to, limit, offset]);
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
          status: row.status,
          createAt: Number(row.create_at),
          updateAt: Number(row.update_at),
          deleteAt: Number(row.delete_at),
          networkId: row.network_id,
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


async function getTransactionById(id) {
  let transaction = {};
  const query = `SELECT * FROM ${TRANSACTION_TBL_NAME} WHERE id = $1`;

  try {
    const { rows } = await pgPool.query(query, [id]);
    if (rows.length > 0) {
      let row = rows[0];
      transaction = {
        id: row.id,
        serialNumber: row.serial_number,
        tokenName: row.token_name,
        value: Number(row.value),
        toAddress: row.to_address,
        fromAddress: row.from_address,
        blockHeight: row.block_height,
        blockHash: row.block_hash,
        txHash: row.tx_hash,
        status: Number(row.status),
        createAt: Number(row.create_at),
        updateAt: Number(row.update_at),
        deleteAt: Number(row.delete_at),
        networkId: row.network_id,
        blockTime: Number(row.block_time),
        bptFee: Number(row.btp_fee) || 0,
        networkFee: Number(row.network_fee) || 0,
      };
    }
    return transaction;
  } catch (error) {
    logger.error('getTransactionById fails', { error });
    throw error;
  }
}
module.exports = {
  getTransactions,
  getTransactionById
};
