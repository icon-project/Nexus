'use strict';

const debug = require('debug')('db');
const { pgPool, logger, logDbError, TRANSACTION_TBL_NAME, TRANSACTION_TBL } = require('../../common');

async function getLatestTransactionByToken(tokenName) {
  try {
    let {
      rows,
    } = await pgPool.query(
      `SELECT * FROM  ${TRANSACTION_TBL_NAME} WHERE ${TRANSACTION_TBL.tokenName} = $1 ORDER BY ${TRANSACTION_TBL.updateAt} DESC LIMIT 1`,
      [tokenName],
    );
    return rows[0];
  } catch (error) {
    logger.error(
      `getLatestTransactionByToken Failed to get transaction result with token ${tokenName}`,
      { error },
    );
  }
}

// Ref: #426
async function findTxBySerialNumber(serialNumber, networkId, contractAddress) {
  const query = 'SELECT * FROM transactions WHERE serial_number=$1 AND network_id=$2 AND contract_address=$3';
  const { rows } = await pgPool.query(query, [serialNumber, networkId, contractAddress]);
  return rows[0];
}

/**
 * Update confirmed status and block info when the transactions has event TransferEnd
 * @param {*} transactions
 * @param {*} txInfo
 */
 async function setTransactionConfirmed(transactions, txInfo, status) {
  try {
    const client = await pgPool.connect();
    await client.query('BEGIN');

    for (const tx of transactions) {
      const query = `
        UPDATE ${TRANSACTION_TBL_NAME}
        SET
          ${TRANSACTION_TBL.status} = $1,
          tx_hash_end = $2,
          tx_error = $3,
          ${TRANSACTION_TBL.updateAt} = NOW(),
          block_hash_end = $5
        WHERE ${TRANSACTION_TBL.txHash} = $4`;

      // blockHash is needed for Moonbeam since Sidecar can only query blocks.
      const values = [status, txInfo.txHash, txInfo.error, tx.tx_hash, txInfo.blockHash];

      await client.query(query, values);
      debug('setTransactionConfirmed SQL %s %O:', query, values);
    }

    await client.query('COMMIT');
    logger.info(`setTransactionConfirmed saved transaction in txHash ${txInfo.txHash}`);
  } catch (error) {
    logger.error('setTransactionConfirmed fails %s', error.message);
  }
}

async function saveTransaction(transaction) {
  try {
    const insertStatement = `INSERT INTO transactions (
      ${TRANSACTION_TBL.fromAddress}, ${TRANSACTION_TBL.tokenName}, ${TRANSACTION_TBL.serialNumber},
      ${TRANSACTION_TBL.value}, ${TRANSACTION_TBL.toAddress},
      ${TRANSACTION_TBL.txHash}, ${TRANSACTION_TBL.blockTime}, ${TRANSACTION_TBL.networkId}, ${TRANSACTION_TBL.btpFee},
      ${TRANSACTION_TBL.networkFee}, ${TRANSACTION_TBL.status}, ${TRANSACTION_TBL.totalVolume}, ${TRANSACTION_TBL.createAt},
      ${TRANSACTION_TBL.updateAt}, block_hash, contract_address)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, NOW(), NOW(), $13, $14)`;

    // blockHash is needed for Moonbeam since Sidecar can only query blocks.
    const insertValues = [
      transaction.fromAddress,
      transaction.tokenName,
      transaction.serialNumber,
      transaction.value,
      transaction.toAddress,
      transaction.txHash,
      transaction.blockTime,
      transaction.networkId,
      transaction.btpFee,
      transaction.networkFee,
      transaction.status,
      transaction.totalVolume,
      transaction.blockHash,
      transaction.contractAddress
    ];

    debug('saveTransaction SQL %s %O:', insertStatement, insertValues);
    await pgPool.query(insertStatement, insertValues);
    logger.info(`saveTransaction saved transaction in txHash ${transaction.txHash}`);
  } catch (error) {
    logger.error('saveTransaction fails: %s, %s', error.message, error.detail);
  }
}

async function getTokenContractAddresses() {
  try {
    const { rows } = await pgPool.query('SELECT DISTINCT(contract_address) FROM token_info');
    return rows.map(row => row.contract_address);
  } catch (error) {
    logger.error('getTokenContractAddresses fails: %s, %s', error.message, error.detail);
  }
}

module.exports = {
  getLatestTransactionByToken,
  findTxBySerialNumber,
  setTransactionConfirmed,
  saveTransaction,
  getTokenContractAddresses
};
