'use strict';

const Web3 = require('web3');
const debug = require('debug')('moonbeam_tx');
const { logger, TRANSACTION_STATUS, ICX_LOOP_UNIT } = require('../../common');
const { findEventByName, decodeEventLog, getMoonbeamEventMap } = require('../common/events');
const { calculateTotalVolume, getTokenContractMap } = require('./model');
const {
  getLatestTransactionByToken,
  findTxBySerialNumber,
  setTransactionConfirmed,
  saveTransaction
} = require('./repository');

const web3 = new Web3(process.env.MOONBEAM_API_URL);
const bmcAddress = process.env.MOONBEAM_BMC_ADDRESS.toLowerCase();

async function handleTransactionEvents(tx, receipt, block) {
  const eventMap = getMoonbeamEventMap();
  const tokenMap = await getTokenContractMap();

  if (tokenMap.has(tx.to.toLowerCase())) {
    const tsEvent = findEventByName('TransferStart', eventMap, receipt.logs);

    if (tsEvent) {
      logger.info(`moonbeam:handleTransactionEvents get TransferStart event in tx ${tx.hash}`);

      const ts = decodeEventLog(web3, eventMap, 'TransferStart', tsEvent);
      await handleTransferStartEvent({ ...ts, contractAddress: tsEvent.address }, tx, receipt, block);
    }
  } else if (bmcAddress === tx.to.toLowerCase()) {
    const teEvent = findEventByName('TransferEnd', eventMap, receipt.logs);

    if (teEvent) {
      logger.info(`moonbeam:handleTransactionEvents get TransferEnd event in tx ${tx.hash}`);

      const te = decodeEventLog(web3, eventMap, 'TransferEnd', teEvent);
      await handleTransferEndEvent({ ...te, contractAddress: teEvent.address }, tx);
    }
  }
}

async function handleTransferStartEvent(event, tx, receipt, block) {
  try {
    const txData = {
      fromAddress: event._from.toLowerCase(),
      toAddress: event._to,
      tokenName: event._assetDetails[0].coinName,
      value: Number(event._assetDetails[0].value) / ICX_LOOP_UNIT,
      btpFee: Number(event._assetDetails[0].fee) / ICX_LOOP_UNIT,
      serialNumber: event._sn,
      txHash: tx.hash,
      blockHash: '',
      status: TRANSACTION_STATUS.pending,
      blockTime: web3.utils.hexToNumber(block.timestamp) * 1000,
      networkId: process.env.MOONBEAM_NETWORK_ID,
      networkFee: (Number(tx.gasPrice) * receipt.gasUsed) / ICX_LOOP_UNIT,
      contractAddress: event.contractAddress
    };

    const latestTransaction = await getLatestTransactionByToken(txData.tokenName);
    const totalVolume = calculateTotalVolume(txData, latestTransaction);

    txData.totalVolume = totalVolume;
    await saveTransaction(txData);
  } catch (error) {
    logger.error(`moonbeam:handleTransferStartEvent fails: ${error.message} in tx ${tx.hash}`);
  }
}

async function handleTransferEndEvent(event, tx) {
  try {
    const statusCode = 0 === Number(event._code) ? TRANSACTION_STATUS.success : TRANSACTION_STATUS.failed;
    const updatingTx = await findTxBySerialNumber(event._sn, process.env.MOONBEAM_NETWORK_ID, event.contractAddress);

    const txData = {
      txHash: tx.hash,
      blockHash: '',
      error: TRANSACTION_STATUS.failed === statusCode ? event._response : ''
    };

    await setTransactionConfirmed([updatingTx], txData, statusCode);
  } catch (error) {
    logger.error(`moonbeam:handleTransferEndEvent fails: ${error.message} in tx ${tx.hash}`);
  }
}

module.exports = {
  handleTransactionEvents
};
