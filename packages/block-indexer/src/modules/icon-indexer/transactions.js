'use strict';

const { decode } = require('rlp');
const { v4: uuidv4 } = require('uuid');
const {
  TRANSACTION_TBL_NAME,
  TRANSACTION_TBL,
  logger,
  TRANSACTION_STATUS,
  pgPool,
} = require('../../common');
const {
  sortValuesWithPropsOrdered,
  propsAsString,
  propsCountValueString,
  getCurrentTimestamp,
  hexToDecimal,
} = require('../../common/util');

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
    let transaction = await getBySerialNumber(hexToDecimal(data[0]));
    let statusCode = transaction.status;
    switch (hexToDecimal(data[1])) {
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
      const value = parseInt(assetTransferDetails[1].toString('hex'), 16) / ICX_STEP;
      const btpFee = parseInt(assetTransferDetails[2].toString('hex'), 16) / ICX_STEP;

      let transObj = {
        fromAddress: indexedData[1],
        tokenName: tokenName,
        serialNumber: hexToDecimal(data[1]),
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
        networkFee: (txResult.stepPrice.c[0] * txResult.stepUsed.c[0]) / ICX_STEP,
      };
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
 *  Save transaction
 * @param {*} transaction
 */
async function saveTransaction(transaction) {
  try {
    preSave(transaction);
    const insertDealer = `INSERT INTO ${TRANSACTION_TBL_NAME} (${propsAsString(
      TRANSACTION_TBL,
    )}) VALUES (${propsCountValueString(TRANSACTION_TBL)})`;
    const insertDealerValues = sortValuesWithPropsOrdered(transaction, TRANSACTION_TBL);
    await pgPool.query(insertDealer, insertDealerValues);
    logger.info('SQL statement insert Transaction %0:', insertDealer, insertDealerValues);
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
          ${TRANSACTION_TBL.txHash} = $4
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
  } = await pgPool.query(`SELECT * FROM  ${TRANSACTION_TBL_NAME} WHERE serial_number = $1`, [
    serialNumber,
  ]);
  return rows[0];
}

module.exports = {
  saveTransaction,
  getBySerialNumber,
  setTransactionConfirmed,
  handleTransEvent,
};
