'use strict';

const Web3 = require('web3');
const debug = require('debug')('bsc_tx');
const { logger, TRANSACTION_STATUS, ICX_LOOP_UNIT } = require('../../common');
const { findEventByName, decodeEventLog, getBscEventMap } = require('../common/events');
const { calculateTotalVolume, getTokenContractMap } = require('./model');
const {
  getLatestTransactionByToken,
  getBySerialNumber,
  setTransactionConfirmed,
  saveTransaction
} = require('./repository');

const web3 = new Web3(process.env.BSC_API_URL);

async function handleTransactionEvents(tx, receipt, block) {
  const eventMap = getBscEventMap();
  const tokenMap = await getTokenContractMap();
  const bmcAddress = process.env.BSC_BMC_ADDRESS.toLowerCase();

  if (tokenMap.has(tx.to.toLowerCase())) {
    const tsEvent = findEventByName('TransferStart', eventMap, receipt.logs);

    if (tsEvent) {
      logger.info(`bsc:handleTransactionEvents get TransferStart event in tx ${tx.hash}`);

      const ts = decodeEventLog(web3, eventMap, 'TransferStart', tsEvent);
      await handleTransferStartEvent(ts, tx, block);
    }
  } else if (bmcAddress === tx.to.toLowerCase()) {
    const teEvent = findEventByName('TransferEnd', eventMap, receipt.logs);

    if (teEvent) {
      logger.info(`bsc:handleTransactionEvents get TransferEnd event in tx ${tx.hash}`);

      const te = decodeEventLog(web3, eventMap, 'TransferEnd', teEvent);
      await handleTransferEndEvent(te, tx);
    }
  }
}

async function handleTransferStartEvent(event, tx, block) {
  try {
    let txData = {
      fromAddress: event.from,
      toAddress: event.to,
      tokenName: event.coinName,
      value: event.value,
      btpFee: event.fee,
      serialNumber: event.sn,
      txHash: tx.hash,
      blockHash: '',
      status: TRANSACTION_STATUS.pending,
      blockTime: web3.utils.hexToNumber(block.timestamp) * 1000,
      networkId: process.env.BSC_NETWORK_ID,
      networkFee: (Number(tx.gasPrice) * receipt.gasUsed) / ICX_LOOP_UNIT
    };

    const latestTransaction = await getLatestTransactionByToken(txData.tokenName);
    const totalVolume = calculateTotalVolume(txData, latestTransaction);

    txData.totalVolume = totalVolume;
    await saveTransaction(txData);
  } catch (error) {
    logger.error(`bsc:handleTransferStartEvent fails: ${error.message} in tx ${tx.hash}`);
  }
}

async function handleTransferEndEvent(event, tx) {
  try {
    const statusCode = 0 === event.code ? TRANSACTION_STATUS.success : TRANSACTION_STATUS.failed;
    const updatingTx = await getBySerialNumber(event.sn, process.env.BSC_NETWORK_ID);

    // Issue: need to keep hashes of both start and end transactions.
    const txData = {
      txHash: tx.hash,
      blockHash: '',
      error: TRANSACTION_STATUS.failed === statusCode ? event.response : ''
    };

    await setTransactionConfirmed([updatingTx], txData, statusCode);
  } catch (error) {
    logger.error(`bsc:handleTransferEndEvent fails: ${error.message} in tx ${tx.hash}`);
  }
}

module.exports = {
  handleTransactionEvents
};
