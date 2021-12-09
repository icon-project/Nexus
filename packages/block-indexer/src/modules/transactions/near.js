'use strict';

const nearApi = require('near-api-js');
const { createLogger, TRANSACTION_STATUS } = require('../../common');
const { calculateTotalVolume, getTokenContractMap } = require('./model');
const {
  getLatestTransactionByToken,
  findTxBySerialNumber,
  setTransactionConfirmed,
  saveTransaction
} = require('./repository');

const TRANFER_START_PROTOTYPE = 'TransferStart(Address,str,int,bytes)';
const TRANFER_END_PROTOTYPE = 'TransferEnd(Address,int,int,bytes)';
const logger = createLogger();

async function handleTransactionEvents(txResult, block) {
  const tokenContractMap = await getTokenContractMap();

  if (tokenContractMap.has(txResult.transaction.receiver_id)) {
    logger.info(`handleTransactionEvents get TransferStart event in tx ${txResult.transaction.hash}`);

    const event = {};
    const data = event.data;
    /*const details = decode(data[2])[0];
    const tokenName = details[0].toString('utf8');
    const value = parseInt(details[1].toString('hex'), 16) / ICX_LOOP_UNIT;
    const btpFee = parseInt(details[2].toString('hex'), 16) / ICX_LOOP_UNIT;*/

    // Ref: https://www.icondev.io/docs/step-estimation#transaction-fee
    const txData = {
      // fromAddress: event.indexed[1],
      // tokenName: tokenName,
      // serialNumber: IconConverter.toNumber(data[1]),
      // value: value,
      // toAddress: data[0],
      txHash: txResult.transaction.hash,
      blockHash: '',
      status: TRANSACTION_STATUS.pending,
      blockTime: Math.floor(block.header.timestamp / 10 ** 6),
      networkId: process.env.NEAR_NETWORK_ID,
      // btpFee: btpFee,
      networkFee: nearApi.utils.format.formatNearAmount(txResult.transaction_outcome.outcome.tokens_burnt),
      // contractAddress: event.scoreAddress // Ref: #426
    };

    // Calculating total volume when the system has a new transaction.
    let latestTransaction = await getLatestTransactionByToken(txData.tokenName);
    const totalVolume = calculateTotalVolume(txData, latestTransaction);

    txData.totalVolume = totalVolume;
    await saveTransaction(txData);
  } else if (process.env.NEAR_BMC_ADDRESS === txResult.transaction.receiver_id) {
    logger.info(`handleTransactionEvents get TransferEnd event in tx ${txResult.transaction.hash}`);
    const event = {};
    await confirmTransferEnd(event, {
      txHash: txResult.transaction.hash,
      blockHash: ''
    });
  }
}

async function confirmTransferEnd(event, txInfo) {
  const data = event.data;

  try {
    /*const transaction = await findTxBySerialNumber(IconConverter.toNumber(data[0]), process.env.ICON_NETWORK_ID, event.scoreAddress);
    const status = IconConverter.toNumber(data[1]);

    let statusCode = transaction.status;

    switch (status) {
      case 0:
        statusCode = TRANSACTION_STATUS.success;
        break;

      case 1:
        statusCode = TRANSACTION_STATUS.failed;
        break;

      default:
        logger.warn('Unexpected TransferEnd status %d', status);
        break;
    }

    txInfo.error = TRANSACTION_STATUS.failed === statusCode ? web3.utils.hexToUtf8(data[2]) : '';
    await setTransactionConfirmed([transaction], txInfo, statusCode);*/
  } catch (error) {
    logger.error('confirmTransferEnd fails to confirm tx %s, %O', txInfo.txHash, error);
  }
}

module.exports = {
  handleTransactionEvents
};
