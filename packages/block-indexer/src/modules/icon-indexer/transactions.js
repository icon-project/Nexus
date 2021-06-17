'use strict'

const { v4: uuidv4 } = require('uuid');
const { TRANSACTION_TBL_NAME, TRANSACTION_TBL, RESULT_CODE, pgPool, logger } = require("../../common");
const { sortValuesWithPropsOrdered, propsAsString, propsCountValueString, getCurrentTimestamp, hexToDecimal } = require("../../common/util");


/**
 * Confirm TransferEnd event
 * @param {*} event
 * @param {*} txInfo
 */
async function confirmTransfEnd(event, txInfo) {
  let indexedData = event.indexed;
  let data = event.data;
  let transaction = await getBySerialNumber(hexToDecimal(indexedData[1]));
  // has transaction and transfer result code must be 0
  if (transaction && hexToDecimal(data[0]) == RESULT_CODE.RC_OK) {
    await setTransactionConfirmed([transaction], txInfo)
  }
}

/**
 * Handle TransferStart and TransferEnd events
 * @param {*} txResult
 */
async function handleTransEvent(txResult) {
  let transactions = [];

  for (let event of txResult.eventLogs) {
    //handle TransactionStart event
    if (event.indexed.find(item => item.includes('TransferStart'))) {
      let indexedData = event.indexed;
      let data = event.data;
      let transObj = {
        fromAddress: indexedData[1],
        tokenName: indexedData[2],
        serialNumber: hexToDecimal(data[0]),
        value: hexToDecimal(data[1]),
        toAddress: data[2],
        txHash: txResult.txHash,
        blockHash: txResult.blockHash,
        blockHeight: txResult.blockHeight,
        confirmed: false,
      }
      transactions.push(transObj)
    } else if ((event.indexed.find(item => item.includes('TransferEnd')))) {
      confirmTransfEnd(event, { txHash: txResult.txHash, blockHeight: txResult.blockHeight, blockHash: txResult.blockHash })
    }
  }
  if (transactions.length > 0) {
    await saveTransaction(transactions);
  }
}



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
      logger.info('SQL statement insert Transaction %0:', insertDealer, insertDealerValues);
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
  saveTransaction,
  getBySerialNumber,
  setTransactionConfirmed,
  handleTransEvent,
};
