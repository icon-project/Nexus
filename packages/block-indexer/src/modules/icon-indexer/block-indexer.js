'use strict';

const debug = require('debug')('icon');
const IconService = require('icon-sdk-js');
const { HttpProvider } = require('icon-sdk-js');
const { logger } = require('../../common');
const { saveBlock, getLastSavedBlock } = require('./repository');
const { loadRegisteredTokens } = require('./fas');
const { handleAuctionEvents } = require('./auctions');
const { handleTransactionEvents } = require('../transactions/icon');
const { handleTransferFeeEvents } = require('./transfer-fee');
const { handleMintEvents } = require('./mint-burn');

const httpProvider = new HttpProvider(process.env.ICON_API_URL);
const iconService = new IconService(httpProvider);

let blockHeight = Number(process.env.ICON_BLOCK_HEIGHT);
let isWaitToStop = false;

async function runTransactionHandlers(transaction, txResult, block) {
  try {
    await handleTransactionEvents(txResult, transaction);
    await handleAuctionEvents(txResult);
    await handleTransferFeeEvents(txResult);
    await handleMintEvents(txResult, transaction);

    // More transaction handlers go here.
  } catch (error) {
    logger.error('icon:runTransactionHandlers fails %O', error);
  }
}

async function getTransactionResult(txHash) {
  try {
    const result = await iconService.getTransactionResult(txHash).execute();
    return result;
  } catch (error) {
    if ('[RPC ERROR] Executing' === error) {
      debug(`${txHash}: ${error}`);
      return null;
    }

    logger.error(`Failed to get transaction result ${txHash}`, { error });
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
    if ('[RPC ERROR] E1005:Not found' === error) {
      debug(`Block height ${height} not found`);
      return null;
    }

    throw error;
  }
}

async function getBlockData() {
  if (!isWaitToStop) {
    const block = await getBlockByHeight(blockHeight);
    const timeout = block ? 1000 : 15000; // Wait longer for new blocks created.

    if (block) {
      if (block.confirmedTransactionList.length > 0) {
        debug('Block: %O', block);

        await saveBlock(block);
        await runBlockHandlers(block);
      }

      ++blockHeight;
    }

    setTimeout(async () => await retryGetBlockData(), timeout);
  }
}

async function retryGetBlockData() {
  try {
    await getBlockData();
  } catch (error) {
    logger.error('Failed to fetch ICON block data, retry in 5 minutes', { error });
    setTimeout(async () => await retryGetBlockData(), 5 * 60 * 1000);
  }
}

async function start() {
  if (-1 === blockHeight) {
    const block = await getLastSavedBlock();

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

  logger.info('Loading registered token list...');
  const tokens = await loadRegisteredTokens(iconService);
  logger.info('Loaded registered token list', { tokens });

  await retryGetBlockData();

  logger.info('Started ICON block indexer');
}

module.exports = {
  start
};
