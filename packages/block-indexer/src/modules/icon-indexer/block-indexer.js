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
  const result = await iconService.getTransactionResult(txHash).execute();
  return result;
}

async function runBlockHandlers(block) {
  for (const tx of block.confirmedTransactionList) {
    debug('Transaction: %O', tx);

    const result = await getTransactionResult(tx.txHash);
    debug('Transaction result: %O', result);

    await saveTransaction(tx, result);
    await runTransactionHandlers(tx, result, block);
  }

  // More block handlers go here.
}

async function getBlockByHeight(height) {
  try {
    const block = await iconService.getBlockByHeight(height).execute();
    return block;
  } catch (error) {
    debug('Block height %d: %s', height, error);

    if ('[RPC ERROR] E1005:Not found' === error)
      return null;
    else
      throw error;
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
      setTimeout(async () => await getBlockData(), 1000);
    } else {
      // Wait longer for new blocks created.
      setTimeout(async () => await getBlockData(), 5000);
    }
  }
}

async function start() {
  logger.info('Starting ICON block indexer at block %d...', blockHeight);

  if (blockHeight < 0) {
    const block = await iconService.getLastBlock().execute();
    blockHeight = block.height;
  }

  await getBlockData();

  logger.info('Started ICON block indexer');
}

module.exports = {
  start
};
