'use strict';

const debug = require('debug')('icon');
const debugTx = require('debug')('icon_tx');
const IconService = require('icon-sdk-js').default;
const { HttpProvider } = IconService;
const { createLogger } = require('../../common');
const { saveIndexedBlockHeight, getIndexedBlockHeight } = require('../bsc-indexer/repository');
// FAS: const { loadRegisteredTokens } = require('./fas');
// FAS: const { handleAuctionEvents } = require('./auctions');
const { handleTransactionEvents } = require('../transactions/icon');
const { getRegisteredTokens } = require('../tokens/model');
// FAS: const { handleTransferFeeEvents } = require('./transfer-fee');
const { handleMintBurnEvents } = require('../mint-burn/icon');
// const { handleTokenRegister } = require('./token-register');
const { handleRelayerAction } = require('./relay-candidate');
const { handleRelayAction } = require('../relays/icon');

const logger = createLogger();

const httpProvider = new HttpProvider(process.env.ICON_API_URL);
const iconService = new IconService(httpProvider);
let blockHeight = Number(process.env.ICON_BLOCK_HEIGHT);
const indexInterval = Number(process.env.ICON_INDEX_INTERVAL);

// from/to address of transactions need to query for receipts.
const watchedTxReceipt = {
  fromAddress: new Map(),
  toAddress: new Map([
    [process.env.ICON_BMC_ADDRESS, true]
  ])
};

async function runTransactionHandlers(transaction, txResult, block) {
  try {
    if (txResult && 1 === txResult.status) {
      await handleTransactionEvents(txResult, transaction);
      // FAS: await handleAuctionEvents(txResult);
      // FAS: await handleTransferFeeEvents(txResult);
      await handleMintBurnEvents(txResult, transaction);
      // await handleTokenRegister(txResult, transaction);
      await handleRelayAction(txResult, transaction);
      await handleRelayerAction(transaction);
    }

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
    // Ignore pending tx to retry later.
    // Ref: https://www.icondev.io/references/reference-manuals/icon-json-rpc-api-v3-specification#icx_gettransactionresult
    if ('[RPC ERROR] Executing' === error || '[RPC ERROR] Invalid params txHash' === error) {
      logger.warn('icon:Pending transaction result %s, %s', txHash, error);
      return null;
    }

    throw error;
  }
}

async function retryGetTransactionResult(tx, block) {
  try {
    const txResult = await getTransactionResult(tx.txHash);

    if (txResult) {
      debugTx('Transaction result: %O', txResult);
      await runTransactionHandlers(tx, txResult, block);
    } else {
      setTimeout(async () => await retryGetTransactionResult(tx, block), 1000);
    }
  } catch (error) {
    if ('[RPC ERROR] Executing' === error.slice(0, 21)) {
      logger.warn(`${error} ${tx.txHash}`);
      setTimeout(async () => await retryGetTransactionResult(tx, block), 1000);
    } else {
      logger.error('icon:Fail to get transaction result %s, %s', tx.txHash, error);
    }
  }
}

async function runBlockHandlers(block) {
  for (const tx of block.confirmedTransactionList) {
    debugTx('Transaction: %O', tx);

    if (tx.to && watchedTxReceipt.toAddress.has(tx.to))
      await retryGetTransactionResult(tx, block);
    else
      await runTransactionHandlers(tx, null, block);
  }

  // More block handlers go here.
}

async function getBlockByHeight(height) {
  try {
    // Issue: it might unresponsive here on btp!!!
    const block = await iconService.getBlockByHeight(height).execute();
    return block;
  } catch (error) {
    if ('[RPC ERROR] E1005:Not found' === error) {
      logger.warn(`icon:Block ${height} not found`);
      return null;
    }

    throw error;
  }
}

async function getBlockData() {
  const block = await getBlockByHeight(blockHeight);
  const timeout = block ? indexInterval : 5000; // Wait longer for new blocks created.

  if (block) {
    debug('Block: %O', block);

    if (block.confirmedTransactionList.length > 0) {
      logger.info(`icon:Received block ${block.height}, ${block.blockHash}`);

      await saveIndexedBlockHeight(block.height, process.env.ICON_NETWORK_ID);
      await runBlockHandlers(block);
    }

    ++ blockHeight;
  }

  setTimeout(async () => await retryGetBlockData(), timeout);
}

async function retryGetBlockData() {
  try {
    await getBlockData();
  } catch (error) {
    // Reading to fast, next block is not available.
    if ('[RPC ERROR] NotFound' === error.slice(0, 20)) {
      logger.warn(error);
      setTimeout(async () => await retryGetBlockData(), 5000);
    } else {
      // Unknown error, just wait longer to try again.
      logger.error('icon:Failed to fetch block %d, retry in 1 minutes: %s', blockHeight, error);
      setTimeout(async () => await retryGetBlockData(), 1 * 60 * 1000);
    }
  }
}

async function start() {
  const contractMap = await getRegisteredTokens();

  for (const [key, value] of contractMap.entries())
    watchedTxReceipt.toAddress.set(key, true);

  // Continue from last indexed block?
  if (-1 === blockHeight) {
    blockHeight = await getIndexedBlockHeight(process.env.ICON_NETWORK_ID);

    if (blockHeight > 0)
      ++ blockHeight;
  }

  const block = await iconService.getLastBlock().execute();

  // Start at head block, and when invalid block height.
  if (0 === blockHeight || blockHeight > block.height)
    blockHeight = block.height;

  logger.info('Starting ICON block indexer at block %d...', blockHeight);

  // FAS: logger.info('Loading registered token list...');
  // FAS: const tokens = await loadRegisteredTokens(iconService);
  // FAS: logger.info('Loaded registered token list', { tokens });

  await retryGetBlockData();
  logger.info('Started ICON block indexer');
}

module.exports = {
  start
};
