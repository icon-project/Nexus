'use strict';

const debug = require('debug')('db');
const { v4: uuidv4 } = require('uuid');
const { pgPool, logger, TRANSACTION_TBL_NAME, TRANSACTION_TBL } = require('../../common');

function preSave(transfer) {
  if (!transfer.id) {
    transfer.id = uuidv4();
  }
  transfer.deleteAt = 0;
}

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

async function getBySerialNumber(serialNumber, networkId) {
  let {
    rows,
  } = await pgPool.query(
    `SELECT * FROM  ${TRANSACTION_TBL_NAME} WHERE ${TRANSACTION_TBL.serialNumber}=$1 AND ${TRANSACTION_TBL.networkId}=$2`,
    [serialNumber, networkId],
  );

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

    for (let transt of transactions) {
      preSave(transt);

      const query = `
        UPDATE ${TRANSACTION_TBL_NAME}
        SET
          ${TRANSACTION_TBL.status} = $1,
          block_height_end = $2,
          tx_hash_end = $3,
          tx_error = $4,
          ${TRANSACTION_TBL.updateAt} = NOW()
        WHERE ${TRANSACTION_TBL.id} = $5`;
      const values = [status, txInfo.blockHeight, txInfo.txHash, txInfo.error, transt.id];

      await client.query(query, values);
      debug('saveTransaction SQL %s %O:', query, values);
    }

    await client.query('COMMIT');
    logger.info(`setTransactionConfirmed saved transaction in txHash ${txInfo.txHash}`);
  } catch (error) {
    logger.error('setTransactionConfirmed fails %s', error.message);
  }
}

async function saveTransaction(transaction) {
  try {
    preSave(transaction);

    const insertStatement = `INSERT INTO transactions (
      ${TRANSACTION_TBL.id}, ${TRANSACTION_TBL.fromAddress}, ${TRANSACTION_TBL.tokenName}, ${TRANSACTION_TBL.serialNumber},
      ${TRANSACTION_TBL.value}, ${TRANSACTION_TBL.toAddress}, ${TRANSACTION_TBL.blockHeight},
      ${TRANSACTION_TBL.txHash}, ${TRANSACTION_TBL.blockTime}, ${TRANSACTION_TBL.networkId}, ${TRANSACTION_TBL.btpFee},
      ${TRANSACTION_TBL.networkFee}, ${TRANSACTION_TBL.status}, ${TRANSACTION_TBL.totalVolume}, ${TRANSACTION_TBL.createAt},
      ${TRANSACTION_TBL.updateAt})
    VALUES (
      $1, $2, $3, $4,
      $5, $6, $7, $8,
      $9, $10, $11, $12,
      $13, $14, NOW(), NOW())`;

    const insertValues = [
      transaction.id,
      transaction.fromAddress,
      transaction.tokenName,
      transaction.serialNumber,
      transaction.value,
      transaction.toAddress,
      transaction.blockHeight,
      transaction.txHash,
      transaction.blockTime,
      transaction.networkId,
      transaction.btpFee,
      transaction.networkFee,
      transaction.status,
      transaction.totalVolume
    ];

    debug('saveTransaction SQL %s %O:', insertStatement, insertValues);
    await pgPool.query(insertStatement, insertValues);
    logger.info(`saveTransaction saved transaction in txHash ${transaction.txHash}`);
  } catch (error) {
    logger.error('saveTransaction fails %s', error.message);
  }
}

module.exports = {
  getLatestTransactionByToken,
  getBySerialNumber,
  setTransactionConfirmed,
  saveTransaction
};
