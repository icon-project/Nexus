const { TRANSACTION_STATUS, TRANSFER_START_EVENT, TRANSFER_END_EVENT, NEAR_GAS_UNIT } = require('../../common');
const { createLogger } = require('../../common/logger');
const { isJSON } = require('../../common/util');
const { logTxHashToSlack } = require('../../slack-bot');
const { getLoopUnitByTokenName } = require('../common/loop-units');
const { getRegisteredTokens } = require('../tokens/model');
const { calculateTotalVolume } = require('./model');
const { getLatestTransactionByToken, saveTransaction, setTransactionConfirmed, findTxBySerialNumber } = require('./repository');
const logger = createLogger();

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
  let networkFee = Number(Number((txResult.transaction_outcome?.outcome?.gas_burnt || 0) / NEAR_GAS_UNIT).toFixed(5));
  for (const receiptOutcome of txResult?.receipts_outcome) {
    const gasFee = Number(Number((receiptOutcome.outcome.gas_burnt || 0) / NEAR_GAS_UNIT).toFixed(5));
    networkFee += gasFee;

    for (const log of receiptOutcome?.outcome?.logs) {
      if (log.includes(TRANSFER_START_EVENT) && isJSON(log)) {
        logger.info(`near:handleTransactionStartEvent get TransferStart event in tx ${tx.hash}`);

        const data = JSON.parse(log);
        const tokenNameRaw = data.assets ? data.assets[0]?.token_name : '';
        const tokenName = tokenNameRaw?.split('-')?.[2];
        const loopUnit = getLoopUnitByTokenName(tokenName);
        const btpFee = (data.assets ? Number(data.assets[0]?.fee) : 0) / loopUnit;
        const amount = (data.assets ? Number(data.assets[0]?.amount) : 0) / loopUnit;
        const transObj = {
          fromAddress: data.sender_address || tx.signer_id,
          tokenName: tokenName || tokenNameRaw,
          tokenNameRaw: tokenNameRaw,
          serialNumber: data.serial_number,
          value: amount,
          toAddress: data.receiver_address,
          txHash: tx.hash,
          status: TRANSACTION_STATUS.pending,
          blockTime: Math.floor(block.header.timestamp / 1000000), // microsecond to millisecond
          networkId: process.env.NEAR_NETWORK_ID,
          btpFee,
          networkFee,
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
          const updatingTx = await findTxBySerialNumber(data.serial_number, process.env.NEAR_NETWORK_ID, receiptOutcome.outcome.executor_id);
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
