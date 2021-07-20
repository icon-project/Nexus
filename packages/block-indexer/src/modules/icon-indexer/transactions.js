'use strict';

const { decode } = require('rlp');
const { v4: uuidv4 } = require('uuid');
const { IconConverter } = require('icon-sdk-js');
const {
  TRANSACTION_TBL_NAME,
  TRANSACTION_TBL,
  logger,
  TRANSACTION_STATUS,
  ICX_LOOP_UNIT,
  pgPool,
} = require('../../common');

const TRANFER_START_PROTOTYPE = 'TransferStart(Address,str,int,bytes)';
const TRANFER_END_PROTOTYPE = 'TransferEnd(Address,int,int,str)';

/**
 * Confirm TransferEnd event
 * @param {*} event
 * @param {*} txInfo
 */
async function confirmTransfEnd(event, txInfo) {
  /**
   * TransferEnd(Address string, serialNumber int, status int, message str)
   *
   */
  let data = event.data;
  try {
    let transaction = await getBySerialNumber(IconConverter.toNumber(data[0]));
    let statusCode = transaction.status;
    switch (IconConverter.toNumber(data[1])) {
      case 0:
        statusCode = TRANSACTION_STATUS.success;
        break;
      case 1:
        statusCode = TRANSACTION_STATUS.failed;
        break;
      default:
        break;
    }
    await setTransactionConfirmed([transaction], txInfo, statusCode);
  } catch (error) {
    logger.error('"confirmTransfEnd" failed confirm transaction', { error });
  }
}

/**
 * Handle TransferStart and TransferEnd events
 * @param {*} txResult
 */
async function handleTransEvent(txResult, transaction) {
  for (let event of txResult.eventLogs) {
    //handle TransactionStart event
    if (event.indexed.find((item) => item.includes(TRANFER_START_PROTOTYPE))) {
      /**
       * TransferStart(Address,str,int,bytes)
       * TransferStart(owner, to.account(), sn, encode(assetTransferDetails));
       * // struct of assetTransferDetails after decoding
       * [
       *      [
       *         tokenName,
       *         amount,
       *         fee
       *      ]
       * ]
       */
      let indexedData = event.indexed;
      let data = event.data;
      const assetTransferDetails = decode(data[2])[0];
      const tokenName = assetTransferDetails[0].toString('utf8');
      const value = parseInt(assetTransferDetails[1].toString('hex'), 16) / ICX_LOOP_UNIT;
      const btpFee = parseInt(assetTransferDetails[2].toString('hex'), 16) / ICX_LOOP_UNIT;

      let transObj = {
        fromAddress: indexedData[1],
        tokenName: tokenName,
        serialNumber: IconConverter.toNumber(data[1]),
        value: value,
        toAddress: data[0],
        txHash: txResult.txHash,
        blockHash: txResult.blockHash,
        blockHeight: txResult.blockHeight,
        status: 0,
        blockTime: transaction.timestamp,
        networkId: transaction.nid.c[0], // get network id
        btpFee: btpFee,
        // https://www.icondev.io/docs/step-estimation#transaction-fee
        networkFee: (txResult.stepPrice.c[0] * txResult.stepUsed.c[0]) / ICX_LOOP_UNIT,
      };

      // calculating total volume when the system has a new transaction
      let latestTransaction = await getLatestTransactionByToken(transObj.tokenName);
      const totalVolume = calculateTotalVolume(transObj, latestTransaction);

      transObj.totalVolume = totalVolume;

      await saveTransaction(transObj);
    } else if (event.indexed.find((item) => item.includes(TRANFER_END_PROTOTYPE))) {
      confirmTransfEnd(event, {
        txHash: txResult.txHash,
        blockHeight: txResult.blockHeight,
        blockHash: txResult.blockHash,
      });
    }
  }
}

function calculateTotalVolume(newTransaction, latestTransaction) {
  let totalVolume = newTransaction.value || 0;
  if (!latestTransaction) {
    return totalVolume;
  }
  totalVolume = Number(latestTransaction.totalVolume) + newTransaction.value || 0;

  return totalVolume;
}

/**
 * Pre-save transaction
 * @param {*} transfer
 */
function preSave(transfer) {
  if (!transfer.id) {
    transfer.id = uuidv4();
  }
  transfer.deleteAt = 0;
}

/**
 *  Save transaction
 * @param {*} transaction
 */
async function saveTransaction(transaction) {
  try {
    preSave(transaction);
    const insertStatement = `INSERT INTO transactions (
      ${TRANSACTION_TBL.id}, ${TRANSACTION_TBL.fromAddress}, ${TRANSACTION_TBL.tokenName}, ${TRANSACTION_TBL.serialNumber},
      ${TRANSACTION_TBL.value}, ${TRANSACTION_TBL.toAddress}, ${TRANSACTION_TBL.blockHeight}, ${TRANSACTION_TBL.blockHash},
      ${TRANSACTION_TBL.txHash}, ${TRANSACTION_TBL.blockTime}, ${TRANSACTION_TBL.networkId}, ${TRANSACTION_TBL.btpFee},
      ${TRANSACTION_TBL.networkFee}, ${TRANSACTION_TBL.status}, ${TRANSACTION_TBL.totalVolume}, ${TRANSACTION_TBL.createAt},
      ${TRANSACTION_TBL.updateAt}, ${TRANSACTION_TBL.deleteAt})
    VALUES (
      $1, $2, $3, $4,
      $5, $6, $7, $8,
      $9, $10, $11, $12,
      $13, $14, NOW(), NOW(),
      $15)`;
    const insertValues = [
      transaction.id,
      transaction.fromAddress,
      transaction.tokenName,
      transaction.serialNumber,
      transaction.value,
      transaction.toAddress,
      transaction.blockHeight,
      transaction.blockHash,
      transaction.txHash,
      transaction.blockTime,
      transaction.networkId,
      transaction.btpFee,
      transaction.networkFee,
      transaction.status,
      transaction.totalVolume,
      transaction.deleteAt,
    ];

    await pgPool.query(insertStatement, insertValues);
    logger.info('SQL statement insert Transaction %0:', insertStatement, insertValues);
  } catch (error) {
    logger.error('saveTransferStart Failed save transaction', { error });
  }
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
      await client.query(
        `
      UPDATE ${TRANSACTION_TBL_NAME}
        SET
          ${TRANSACTION_TBL.status} = $1,
          ${TRANSACTION_TBL.blockHash} = $2,
          ${TRANSACTION_TBL.blockHeight} = $3,
          ${TRANSACTION_TBL.txHash} = $4,
          ${TRANSACTION_TBL.updateAt} = NOW(),
        WHERE ${TRANSACTION_TBL.id} = $5`,
        [status, txInfo.blockHash, txInfo.blockHeight, txInfo.txHash, transt.id],
      );
    }
    await client.query('COMMIT');
  } catch (error) {
    logger.error(
      `saveTransferStart Failed to set confirmed for transaction result: ${txInfo.txHash},  ${txInfo.blockHeight}`,
      { error },
    );
  }
}

/**
 * Get transaction by serial number
 * @param {*} serialNumber
 */
async function getBySerialNumber(serialNumber) {
  let {
    rows,
  } = await pgPool.query(
    `SELECT * FROM  ${TRANSACTION_TBL_NAME} WHERE ${TRANSACTION_TBL.serialNumber} = $1`,
    [serialNumber],
  );
  return rows[0];
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

module.exports = {
  saveTransaction,
  getBySerialNumber,
  setTransactionConfirmed,
  handleTransEvent,
  getLatestTransactionByToken,
};
