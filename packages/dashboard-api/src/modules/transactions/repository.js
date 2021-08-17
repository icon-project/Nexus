'use strict';

const {
  logger,
  pgPool,
  TRANSACTION_TBL_NAME,
  TRANSACTION_TBL,
  numberToFixedAmount,
  NETWORK_TBL_NAME,
} = require('../../common');

async function getTransactions(page = 0, limit = 20, from, to, assestName) {
  let offset = page * limit;
  let query = `SELECT *, COUNT(*) OVER() as total FROM ${TRANSACTION_TBL_NAME} WHERE value <> $1`;
  const limitOffset = ' LIMIT $2 OFFSET $3';
  let params = [0, limit, offset];

  if (from) {
    query += ` AND ${TRANSACTION_TBL.networkId}=$${params.length + 1}`;
    params.push(from);
  }

  if (to) {
    query += ` AND ${TRANSACTION_TBL.toAddress} ~ $${params.length + 1}`;
    params.push(to);
  }

  if (assestName) {
    query += ` AND ${TRANSACTION_TBL.tokenName} ILIKE $${params.length + 1}`;
    params.push(assestName);
  }

  query += limitOffset;

  try {
    const { rows } = await pgPool.query(query, params);
    const transactions = [];
    let total = 0;

    if (rows.length > 0) {
      for (const row of rows) {
        transactions.push({
          id: row.id,
          tokenName: row.token_name,
          value: numberToFixedAmount(Number(row.value)),
          txHash: row.tx_hash,
          status: row.status,
          blockTime: Number(row.block_time),
        });

        total = row.total;
      }
    }

    return { transactions, total: Number(total) };
  } catch (error) {
    logger.error('getHistories fails', { error });
    throw error;
  }
}

async function getTransactionById(id) {
  let transaction = {};
  const query = `SELECT  ${TRANSACTION_TBL_NAME}.*, name, native_token FROM ${TRANSACTION_TBL_NAME}
                    INNER JOIN ${NETWORK_TBL_NAME}
                      ON ${TRANSACTION_TBL_NAME}.${TRANSACTION_TBL.networkId} = ${NETWORK_TBL_NAME}.id
                    WHERE ${TRANSACTION_TBL_NAME}.${TRANSACTION_TBL.id} = $1 `;

  try {
    const { rows } = await pgPool.query(query, [id]);
    if (rows.length > 0) {
      let row = rows[0];
      transaction = {
        id: row.id,
        serialNumber: row.serial_number,
        tokenName: row.token_name,
        value: numberToFixedAmount(Number(row.value)),
        toAddress: row.to_address,
        fromAddress: row.from_address,
        blockHeight: row.block_height,
        blockHash: row.block_hash,
        txHash: row.tx_hash,
        status: Number(row.status),
        createAt: Number(row.create_at),
        updateAt: Number(row.update_at),
        networkId: row.network_id,
        blockTime: Number(row.block_time),
        bptFee: numberToFixedAmount(Number(row.btp_fee) || 0),
        networkFee: numberToFixedAmount(Number(row.network_fee) || 0),
        networkNameSrc: row.name,
        nativeToken: row.native_token,
      };
    }
    return transaction;
  } catch (error) {
    logger.error('getTransactionById fails', { error });
    throw error;
  }
}

/**
 * Get total transaction volume all time or total transaction volume of 24h ago
 * @param {*} is24hAgo true/false default false
 * @param {*} sortBy DESC/ASC default DESC
 */
async function getTotalTransactionVolume(is24hAgo = false, sortBy = 'DESC') {
  try {
    let query = `SELECT DISTINCT ON (${TRANSACTION_TBL.tokenName}) ${TRANSACTION_TBL.tokenName}, ${TRANSACTION_TBL.updateAt}, ${TRANSACTION_TBL.totalVolume}, ${TRANSACTION_TBL.networkId}
    FROM ${TRANSACTION_TBL_NAME}
    WHERE ${TRANSACTION_TBL.status} = 1 `;
    const orderBy = ` ORDER BY ${TRANSACTION_TBL.tokenName}, ${TRANSACTION_TBL.updateAt} ${sortBy}`;

    if (is24hAgo) {
      const at24hAgo = new Date().getTime() * 1000 - 86400000000; // current_time(microsecond) - 24h(microsecond)
      query += ` AND ${TRANSACTION_TBL.blockTime} >= ${at24hAgo} ` + orderBy;
    } else {
      query += orderBy;
    }

    const { rows } = await pgPool.query(query);
    let result = [];
    for (let data of rows) {
      result.push({
        networkId: data.network_id,
        tokenName: data.token_name,
        totalVolume: data.total_volume,
      });
    }
    return result;
  } catch (error) {
    logger.error('getTokenVolumeAllTime fails', { error });
    throw error;
  }
}

async function countAllTransaction() {
  const {
    rows: [result],
  } = await pgPool.query(
    `SELECT COUNT(*) FROM ${TRANSACTION_TBL_NAME}`,
  );
  return Number(result.count) || 0;
}

module.exports = {
  getTransactions,
  getTransactionById,
  getTotalTransactionVolume,
  countAllTransaction,
};
