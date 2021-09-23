'use strict';

const debug = require('debug')('icon');
const debugTx = require('debug')('icon_tx');
const IconService = require('icon-sdk-js');
const { HttpProvider } = require('icon-sdk-js');
const { logger } = require('../../common');
const { saveIndexedBlockHeight, getIndexedBlockHeight } = require('../bsc-indexer/repository');
const { loadRegisteredTokens } = require('./fas');
const { handleAuctionEvents } = require('./auctions');
const { handleTransactionEvents } = require('../transactions/icon');
const { handleTransferFeeEvents } = require('./transfer-fee');
const { handleMintBurnEvents } = require('./mint-burn');
const { handleTokenRegister } = require('./token-register');
const { handleRelayerAction } = require('./relay-candidate');
const { handleRelayAction } = require('../relays/icon');

const httpProvider = new HttpProvider(process.env.ICON_API_URL);
const iconService = new IconService(httpProvider);

let blockHeight = Number(process.env.ICON_BLOCK_HEIGHT);
let isWaitToStop = false;

async function runTransactionHandlers(transaction, txResult, block) {
  try {
    await handleTransactionEvents(txResult, transaction);
    await handleAuctionEvents(txResult);
    await handleTransferFeeEvents(txResult);
    await handleMintBurnEvents(txResult, transaction);
    await handleTokenRegister(txResult, transaction);
    await handleRelayAction(txResult, transaction);
    await handleRelayerAction(txResult, transaction);
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
      debugTx(`${txHash}: ${error}`);
      return null;
    }

    logger.error(`Failed to get transaction result ${txHash}`, { error });
  }
}

async function retryGetTransactionResult(tx, block) {
  const txResult = await getTransactionResult(tx.txHash);

  if (txResult) {
    debugTx('Transaction result: %O', txResult);

    // await saveTransaction(tx, txResult);
    await runTransactionHandlers(tx, txResult, block);
  } else {
    setTimeout(async () => await retryGetTransactionResult(tx, block), 5000);
  }
}

async function runBlockHandlers(block) {
  for (const tx of block.confirmedTransactionList) {
    debugTx('Transaction: %O', tx);

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
        logger.info(`Received ICON block ${block.height}, ${block.blockHash}`);
        debug('Block: %O', block);

        await saveIndexedBlockHeight(block.height, process.env.ICON_NETWORK_ID);
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
    blockHeight = await getIndexedBlockHeight(process.env.ICON_NETWORK_ID);

    if (blockHeight > 0)
      ++ blockHeight;
  }

  if (0 === blockHeight) {
    const block = await iconService.getLastBlock().execute();
    blockHeight = block.height;
  }

  logger.info('Starting ICON block indexer at block %d...', blockHeight);

  // Issue: FAS is not available on BSC testnet.
  // logger.info('Loading registered token list...');
  // const tokens = await loadRegisteredTokens(iconService);
  // logger.info('Loaded registered token list', { tokens });

  await retryGetBlockData();

  logger.info('Started ICON block indexer');
}

module.exports = {
  start,
};
