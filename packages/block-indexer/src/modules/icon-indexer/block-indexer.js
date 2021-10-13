'use strict';

const debug = require('debug')('icon');
const debugTx = require('debug')('icon_tx');
const IconService = require('icon-sdk-js').default;
const { HttpProvider } = IconService;
const { logger } = require('../../common');
const { saveIndexedBlockHeight, getIndexedBlockHeight } = require('../bsc-indexer/repository');
// FAS: const { loadRegisteredTokens } = require('./fas');
// FAS: const { handleAuctionEvents } = require('./auctions');
const { handleTransactionEvents } = require('../transactions/icon');
const { getTokenContractMap } = require('../transactions/model');
// FAS: const { handleTransferFeeEvents } = require('./transfer-fee');
const { handleMintBurnEvents } = require('../mint-burn/icon');
// const { handleTokenRegister } = require('./token-register');
const { handleRelayerAction } = require('./relay-candidate');
const { handleRelayAction } = require('../relays/icon');

console.log(IconService);
console.log(IconService.HttpProvider);

const httpProvider = new HttpProvider(process.env.ICON_API_URL);
const iconService = new IconService(httpProvider);

let blockHeight = Number(process.env.ICON_BLOCK_HEIGHT);

async function runTransactionHandlers(transaction, txResult, block) {
  try {
    await handleTransactionEvents(txResult, transaction);
    // FAS: await handleAuctionEvents(txResult);
    // FAS: await handleTransferFeeEvents(txResult);
    await handleMintBurnEvents(txResult, transaction);
    // await handleTokenRegister(txResult, transaction);
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
    // Ignore pending tx to retry later.
    // Ref: https://www.icondev.io/references/reference-manuals/icon-json-rpc-api-v3-specification#icx_gettransactionresult
    if ('[RPC ERROR] Executing' === error || '[RPC ERROR] Invalid params txHash' === error) {
      logger.info('icon:Query pending tx %s, %s', txHash, error);
      return null;
    }

    logger.error('icon:Fail to get transaction result %s, %s', txHash, error);
  }
}

async function retryGetTransactionResult(tx, block) {
  const txResult = await getTransactionResult(tx.txHash);

  if (txResult) {
    debugTx('Transaction result: %O', txResult);
    await runTransactionHandlers(tx, txResult, block);
  } else {
    // TODO: limit retrying.
    setTimeout(async () => await retryGetTransactionResult(tx, block), 2000);
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
    // Issue: it might unresponsive here on btp!!!
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
  const block = await getBlockByHeight(blockHeight);
  const timeout = block ? 1000 : 10000; // Wait longer for new blocks created.

  if (block) {
    debug('Block: %O', block);

    if (block.confirmedTransactionList.length > 0) {
      logger.info(`Received ICON block ${block.height}, ${block.blockHash}`);

      await saveIndexedBlockHeight(block.height, process.env.ICON_NETWORK_ID);
      await runBlockHandlers(block);
    }

    ++blockHeight;
  }

  // TODO: limit retrying.
  setTimeout(async () => await retryGetBlockData(), timeout);
}

async function retryGetBlockData() {
  try {
    await getBlockData();
  } catch (error) {
    logger.error('Failed to fetch ICON block data, retry in 5 minutes: %s', error);
    setTimeout(async () => await retryGetBlockData(), 5 * 60 * 1000);
  }
}

async function start() {
  const tokenContractMap = await getTokenContractMap();
  logger.info('ICON registered tokens: %O', tokenContractMap);

  if (-1 === blockHeight) {
    blockHeight = await getIndexedBlockHeight(process.env.ICON_NETWORK_ID);

    if (blockHeight > 0) ++blockHeight;
  }

  if (0 === blockHeight) {
    const block = await iconService.getLastBlock().execute();
    blockHeight = block.height;
  }

  logger.info('Starting ICON block indexer at block %d...', blockHeight);

  // FAS: logger.info('Loading registered token list...');
  // FAS: const tokens = await loadRegisteredTokens(iconService);
  // FAS: logger.info('Loaded registered token list', { tokens });

  await retryGetBlockData();
  logger.info('Started ICON block indexer');
}

module.exports = {
  start,
};
