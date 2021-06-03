'use strict';

const debug = require('debug')('icon');
const IconService = require('icon-sdk-js');
const { HttpProvider } = require('icon-sdk-js');
const { logger } = require('../../common');
const { saveBlock, saveTransaction } = require('./repository');

const httpProvider = new HttpProvider(process.env.ICON_API_URL);
const iconService = new IconService(httpProvider);

let blockHeight = Number(process.env.ICON_BLOCK_HEIGHT);
let isWaitToStop = false;

async function runTransactionHandlers(transaction, txResult, block) {
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

    await saveTransaction(tx, txResult);
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

      ++ blockHeight;
      setTimeout(async () => await getBlockData(), 2000);
    } else {
      // Wait longer for new blocks created.
      setTimeout(async () => await getBlockData(), 10000);
    }
  }
}

async function start() {
  logger.info('Starting ICON block indexer at block %d...', blockHeight);

  if (blockHeight < 0) {
    const block = await iconService.getLastBlock().execute();
    blockHeight = block.height;
  }

  // TODO: get last block from database.

  await getBlockData();

  logger.info('Started ICON block indexer');
}

module.exports = {
  start
};
