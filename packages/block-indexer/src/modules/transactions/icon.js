'use strict';

const { decode } = require('rlp');
const { IconConverter } = require('icon-sdk-js');
const Web3 = require('web3');
const { logger, TRANSACTION_STATUS, ICX_LOOP_UNIT } = require('../../common');
const { calculateTotalVolume } = require('./model');
const {
  getLatestTransactionByToken,
  getBySerialNumber,
  setTransactionConfirmed,
  saveTransaction
} = require('./repository');

const TRANFER_START_PROTOTYPE = 'TransferStart(Address,str,int,bytes)';
const TRANFER_END_PROTOTYPE = 'TransferEnd(Address,int,int,bytes)';
const web3 = new Web3(process.env.MOONBEAM_API_URL);

/**
 * * TransferEnd(Address string, serialNumber int, status int, message str)
 */
async function confirmTransferEnd(event, txInfo) {
  const data = event.data;

  try {
    const transaction = await getBySerialNumber(IconConverter.toNumber(data[0]), process.env.ICON_NETWORK_ID);
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

    txInfo.error = TRANSACTION_STATUS.failed === statusCode ? web3.utils.hexToUtf8(data[2]) : '';
    await setTransactionConfirmed([transaction], txInfo, statusCode);
  } catch (error) {
    logger.error('confirmTransferEnd failed confirm transaction %O', error);
  }
}

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
/**
 * Handle TransferStart and TransferEnd events
 */
async function handleTransactionEvents(txResult, transaction) {
  if (1 !== txResult.status || 0 === txResult.eventLogs.length)
    return false;

  if (process.env.ICON_NATIVE_COIN_BSH_ADDRESS === txResult.to) {
    for (const event of txResult.eventLogs) {
      if (TRANFER_START_PROTOTYPE !== event.indexed[0])
        continue;

      const data = event.data;
      const details = decode(data[2])[0];
      const tokenName = details[0].toString('utf8');
      const value = parseInt(details[1].toString('hex'), 16) / ICX_LOOP_UNIT;
      const btpFee = parseInt(details[2].toString('hex'), 16) / ICX_LOOP_UNIT;

      // Ref: https://www.icondev.io/docs/step-estimation#transaction-fee
      let transObj = {
        fromAddress: event.indexed[1],
        tokenName: tokenName,
        serialNumber: IconConverter.toNumber(data[1]),
        value: value,
        toAddress: data[0],
        txHash: txResult.txHash,
        blockHeight: txResult.blockHeight,
        status: TRANSACTION_STATUS.pending,
        blockTime: Math.floor(transaction.timestamp / 1000), // microsecond to millisecond
        networkId: process.env.ICON_NETWORK_ID,
        btpFee: btpFee,
        networkFee: (txResult.stepPrice.c[0] * txResult.stepUsed.c[0]) / ICX_LOOP_UNIT
      };

      // Calculating total volume when the system has a new transaction.
      let latestTransaction = await getLatestTransactionByToken(transObj.tokenName);
      const totalVolume = calculateTotalVolume(transObj, latestTransaction);

      transObj.totalVolume = totalVolume;
      await saveTransaction(transObj);
    }
  } else if (process.env.ICON_BMC_ADDRESS === txResult.to) {
    for (const event of txResult.eventLogs) {
      if (TRANFER_END_PROTOTYPE !== event.indexed[0])
        continue;

      confirmTransferEnd(event, {
        txHash: txResult.txHash,
        blockHeight: txResult.blockHeight
      });
    }
  }
}

module.exports = {
  handleTransactionEvents
};
