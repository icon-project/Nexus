'use strict';
const { v4: uuidv4 } = require('uuid');
const { TRANSACTION_TBL_NAME, TRANSACTION_TBL, pgPool, logger } = require("../../common");
const { debug } = require('../../common/logger');
const { sortValuesWithPropsOrdered, propsAsString, propsCountValueString, getCurrentTimestamp } = require("../../common/util");


async function saveBlock(block) { }
/**
 * Pre-save transaction
 * @param {*} transfer
 */
function preSave(transfer) {
  if (!transfer.id) {
    transfer.id = uuidv4();
    transfer.createAt = getCurrentTimestamp();
  }
  transfer.updateAt = getCurrentTimestamp();
  transfer.deleteAt = 0;
}

/**
 * Batch save transaction
 * @param {*} transactions
 */
async function saveTransaction(transactions) {
  try {
    const client = await pgPool.connect();
    await client.query('BEGIN');
    for (let trans of transactions) {
      preSave(trans);
      const insertDealer = `INSERT INTO ${TRANSACTION_TBL_NAME} (${propsAsString(TRANSACTION_TBL)}) VALUES (${propsCountValueString(TRANSACTION_TBL)})`;
      const insertDealerValues = sortValuesWithPropsOrdered(trans, TRANSACTION_TBL);
      await client.query(insertDealer, insertDealerValues);
      debug('SQL statement insert Transaction %0:', insertDealer, insertDealerValues);
    }
    await client.query('COMMIT');
  } catch (error) {
    logger.error(`saveTransferStart Failed save transaction result: ${trans.txHash} ${trans.blockHeight}`, { error });
    throw error;
  }
}

/**
 * Update confirmed status and block info when the transactions has event TransferEnd
 * @param {*} transactions
 * @param {*} txInfo
 */
async function setTransactionConfirmed(transactions, txInfo) {
  try {
    const client = await pgPool.connect();
    await client.query('BEGIN');
    for (let transt of transactions) {
      preSave(transt);
      await client.query(`
      UPDATE ${TRANSACTION_TBL_NAME}
        SET
          ${TRANSACTION_TBL.confirmed} = true,
          ${TRANSACTION_TBL.blockHash} = $1,
          ${TRANSACTION_TBL.blockHeight} = $2,
          ${TRANSACTION_TBL.txHash} = $3
        WHERE ${TRANSACTION_TBL.id} = $4`, [txInfo.blockHash, txInfo.blockHeight, txInfo.txHash, transt.id]);
    }
    await client.query('COMMIT');
  } catch (error) {
    logger.error(`saveTransferStart Failed to set confirmed for transaction result: ${txInfo.txHash},  ${txInfo.blockHeight}`, { error });
    throw error;
  }
}

/**
 * Get transaction by serial number
 * @param {*} serialNumber
 */
async function getBySerialNumber(serialNumber) {
  let { rows } = await pgPool.query(`SELECT * FROM  ${TRANSACTION_TBL_NAME} WHERE serial_number = $1`, [serialNumber]);
  return rows[0];
}



module.exports = {
  saveBlock,
  saveTransaction,
  getBySerialNumber,
  setTransactionConfirmed
};
