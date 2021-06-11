'use strict';

const debug = require('debug')('icon');
const IconService = require('icon-sdk-js');
const { HttpProvider } = require('icon-sdk-js');
const { logger, RESULT_CODE } = require('../../common');
const { hexToDecimal } = require('../../common/util');
const { saveBlock, saveTransaction, setTransactionConfirmed, getBySerialNumber, getLastBlock } = require('./repository');
const { handleAuctionEvents } = require('./auctions');

const httpProvider = new HttpProvider(process.env.ICON_API_URL);
const iconService = new IconService(httpProvider);

let blockHeight = Number(process.env.ICON_BLOCK_HEIGHT);
let isWaitToStop = false;

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

async function runTransactionHandlers(transaction, txResult, block) {
  await handleTransEvent(txResult);
  await handleAuctionEvents(txResult);

  // More transaction handlers go here.
}

async function getTransactionResult(txHash) {
  try {
    const result = await iconService.getTransactionResult(txHash).execute();
    return result;
  } catch (error) {
    if ('[RPC ERROR] Executing' !== error) {
      logger.error(`Failed to get transaction result ${txHash}`, { error });
      throw error;
    }

    debug(`${txHash}: ${error}`);
    return null;
  }
}

async function retryGetTransactionResult(tx, block) {
  const txResult = await getTransactionResult(tx.txHash);

  if (txResult) {
    debug('Transaction result: %O', txResult);

    // await saveTransaction(tx, txResult);
    await runTransactionHandlers(tx, txResult, block);
  } else {
    setTimeout(async () => await retryGetTransactionResult(tx, block), 5000);
  }
}

async function runBlockHandlers(block) {
  for (const tx of block.confirmedTransactionList) {
    debug('Transaction: %O', tx);

    await retryGetTransactionResult(tx, block);
  }

  // More block handlers go here.
}

async function getBlockByHeight(height) {
  try {
    const block = await iconService.getBlockByHeight(height).execute();
    return block;
  } catch (error) {
    if ('[RPC ERROR] E1005:Not found' !== error) {
      logger.error(`Failed to get block ${height}`, { error });
      throw error;
    }

    debug(`Block height ${height}: ${error}`);
    return null;
  }
}

async function getBlockData() {
  if (!isWaitToStop) {
    const block = await getBlockByHeight(blockHeight);

    if (block) {
      if (block.confirmedTransactionList.length > 0) {
        debug('Block: %O', block);
        await saveBlock(block);
        await runBlockHandlers(block);
      }

      ++blockHeight;
      setTimeout(async () => await getBlockData(), 1000);
    } else {
      // Wait longer for new blocks created.
      setTimeout(async () => await getBlockData(), 10000);
    }
  }
}

async function start() {
  if (-1 === blockHeight) {
    const block = await getLastBlock();

    if (block)
      blockHeight = block.height + 1;
    else
      blockHeight = 0;
  }

  if (0 === blockHeight) {
    const block = await iconService.getLastBlock().execute();
    blockHeight = block.height;
  }

  logger.info('Starting ICON block indexer at block %d...', blockHeight);

  await getBlockData();

  logger.info('Started ICON block indexer');
}

module.exports = {
  start
};
