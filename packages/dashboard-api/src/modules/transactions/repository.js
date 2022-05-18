'use strict';

const debug = require('debug')('db');
const {
  logger,
  pgPool,
  TRANSACTION_TBL_NAME,
  TRANSACTION_TBL,
  numberToFixedAmount,
  NETWORK_TBL_NAME,
} = require('../../common');

async function getTransactions(page = 0, limit = 20, from, to, assestName, startDate, endDate) {
  let offset = page * limit;
  let query = `SELECT *, COUNT(*) OVER() as total FROM ${TRANSACTION_TBL_NAME} INNER JOIN ${NETWORK_TBL_NAME}
  ON ${TRANSACTION_TBL_NAME}.${TRANSACTION_TBL.networkId} = ${NETWORK_TBL_NAME}.id WHERE value <> $1`;

  const limitOffset = ' ORDER BY block_time DESC LIMIT $2 OFFSET $3';
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

  if (startDate) {
    query += ` AND create_at >= '${startDate}'`;
  }
  if (endDate) {
    query += ` AND create_at <= '${endDate}'`;
  }

  query += limitOffset;
  debug('getTransactions: %s', query);

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
          networkNameSrc: row.name,
          toAddress: row.to_address,
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

async function getTransactionByTxHash(hash) {
  const query = `SELECT  ${TRANSACTION_TBL_NAME}.*, name, native_token FROM ${TRANSACTION_TBL_NAME}
                    INNER JOIN ${NETWORK_TBL_NAME}
                      ON ${TRANSACTION_TBL_NAME}.${TRANSACTION_TBL.networkId} = ${NETWORK_TBL_NAME}.id
                    WHERE ${TRANSACTION_TBL_NAME}.${TRANSACTION_TBL.txHash} = $1 `;

  debug('getTransactionByTxHash:', query, hash);

  try {
    const { rows } = await pgPool.query(query, [hash]);

    if (rows.length > 0) {
      let row = rows[0];

      const transaction = {
        serialNumber: row.serial_number,
        tokenName: row.token_name,
        value: numberToFixedAmount(Number(row.value)),
        toAddress: row.to_address,
        fromAddress: row.from_address,
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
        txError: row.tx_error
      };

      return transaction;
    }
  } catch (error) {
    logger.error('getTransactionByTxHash fails', { error });
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
      const at24hAgo = new Date().getTime() - (24 * 60 * 60 * 1000);
      query += ` AND ${TRANSACTION_TBL.blockTime} >= ${at24hAgo} ` + orderBy;
    } else {
      query += orderBy;
    }

    debug('getTotalTransactionVolume: %s', query);
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
  getTransactionByTxHash,
  getTotalTransactionVolume,
  countAllTransaction,
};
