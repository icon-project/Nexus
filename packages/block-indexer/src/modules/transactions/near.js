const { TRANSACTION_STATUS, TRANSFER_START_EVENT, TRANSFER_END_EVENT } = require('../../common');
const logger = require('../../common/logger');
const { isJSON } = require('../../common/util');
const { logTxHashToSlack } = require('../../slack-bot');
const { getRegisteredTokens } = require('../tokens/model');
const { calculateTotalVolume } = require('./model');
const { getLatestTransactionByToken, saveTransaction, setTransactionConfirmed, findTxBySerialNumber } = require('./repository');

async function handleTransactionEvents(tx, txResult, block) {
  const tokenMap = await getRegisteredTokens();

  if (tokenMap.has(tx.receiver_id)) {
    await handleTransactionStartEvent(tx, txResult, block);
  } else if (process.env.NEAR_BMC_ADDRESS === tx.receiver_id) {
    await handleTransactionEndEvent(tx, txResult, block);
  }
}

/*
TransferStart
*/
async function handleTransactionStartEvent(tx, txResult, block) {
  for (const receiptOutcome of txResult?.receipts_outcome) {
    for (const log of receiptOutcome?.outcome?.logs) {
      if (log.includes(TRANSFER_START_EVENT) && isJSON(log)) {
        logger.info(`near:handleTransactionStartEvent get TransferStart event in tx ${tx.hash}`);

        const data = JSON.parse(log);
        const tokenNameRaw = ''; // TODO
        const tokenName = tokenNameRaw?.split('-')?.[2];

        const transObj = {
          fromAddress: data.sender_address || tx.signer_id,
          tokenName: tokenName || tokenNameRaw,
          tokenNameRaw: tokenNameRaw,
          serialNumber: data.serial_number,
          value: data.amount,
          toAddress: data.receiver_address,
          txHash: tx.hash,
          status: TRANSACTION_STATUS.pending,
          blockTime: Math.floor(block.header.timestamp / 1000), // microsecond to millisecond
          networkId: process.env.NEAR_NETWORK_ID,
          btpFee: data.fee,
          networkFee: '', // TODO
          contractAddress: tx.receiver_id
        };

        // Calculating total volume when the system has a new transaction.
        const latestTransaction = await getLatestTransactionByToken(transObj.tokenName);
        const totalVolume = calculateTotalVolume(transObj, latestTransaction);

        transObj.totalVolume = totalVolume;

        // Log a transaction to slack channel
        logTxHashToSlack(
          transObj.toAddress,
          transObj.fromAddress,
          transObj.txHash,
          transObj.blockTime,
          transObj.btpFee,
          transObj.networkFee,
          transObj.status,
          transObj.value,
          transObj.networkId,
          TRANSFER_START_EVENT
        );
        await saveTransaction(transObj);
      }
    }
  }
}

async function handleTransactionEndEvent(tx, txResult, block) {
  for (const receiptOutcome of txResult?.receipts_outcome) {
    for (const log of receiptOutcome?.outcome?.logs) {
      if (log.includes(TRANSFER_END_EVENT) && isJSON(log)) {
        logger.info(`near:handleTransactionStartEvent get TransferStart event in tx ${tx.hash}`);

        const data = JSON.parse(log);
        try {
          const statusCode = Number(data.code) === 0 ? TRANSACTION_STATUS.success : TRANSACTION_STATUS.failed;
          const updatingTx = await findTxBySerialNumber(data.serial_number, process.env.NEAR_NETWORK_ID, tx.receiver_id);

          const txData = {
            txHash: tx.hash,
            error: TRANSACTION_STATUS.failed === statusCode ? data.message : ''
          };

          // Log a transaction to slack channel when update transaction's status
          if (updatingTx) {
            logTxHashToSlack(
              updatingTx.to_address,
              updatingTx.from_address,
              txData.txHash,
              updatingTx.block_time,
              updatingTx.btp_fee,
              updatingTx.network_fee,
              statusCode,
              updatingTx.value,
              updatingTx.network_id,
              TRANSFER_END_EVENT
            );
          }
          await setTransactionConfirmed(updatingTx, txData, statusCode);
        } catch (error) {
          logger.error(`near:handleTransactionEndEvent fails: ${error.message} in tx ${tx.hash}`);
        }
      }
    }
  }
}

module.exports = {
  handleTransactionEvents
};
