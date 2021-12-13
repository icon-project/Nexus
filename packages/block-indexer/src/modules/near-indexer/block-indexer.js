'use strict';

const debug = require('debug')('near');
const debugTx = require('debug')('near_tx');
const nearApi = require('near-api-js');
const { createLogger } = require('../../common');
const { saveIndexedBlockHeight, getIndexedBlockHeight } = require('../bsc-indexer/repository');
const { handleMintBurnEvents } = require('../mint-burn/near');

const provider = new nearApi.providers.JsonRpcProvider(process.env.NEAR_API_URL);
const pollingInterval = Number(process.env.POLLING_INTERVAL);
const pollingRetryInterval = Number(process.env.POLLING_RETRY_INTERVAL);
const pollingTimeout = Number(process.env.POLLING_TIMEOUT);

let blockRetry = 0;
let blockHeight = Number(process.env.NEAR_BLOCK_HEIGHT);
const logger = createLogger();

// All transaction handlers go here.
async function runTransactionHandlers(tx, result, block) {
  try {
    await handleMintBurnEvents(result, block);
  } catch (error) {
    logger.error('near:runTransactionHandlers fails %O', error);
  }
}

async function retryGetTransactionReceipt(tx, block) {
  const result = await provider.txStatus(tx.hash, tx.signer_id);

  if (result) {
    debugTx('Transaction receipt: %O', result);
    await runTransactionHandlers(tx, result, block);
  } else {
    setTimeout(async () => await retryGetTransactionReceipt(tx, block), pollingRetryInterval);
  }
}

async function runBlockHandlers(block) {
  for (const chunk of block.chunks) {
    const result = await provider.chunk(chunk.chunk_hash);

    for (const tx of result.transactions) {
      debugTx('Transaction: %O', tx);
      await retryGetTransactionReceipt(tx, block);
    }
  }

  // More block handlers go here.
}

async function getBlockData() {
  try {
    const block = await provider.block({ blockId: blockHeight });

    if (block.chunks.length > 0) {
      logger.info(`near:getBlockData received block ${block.header.height}, ${block.header.hash}`);
      debug('Block: %O', block);

      await saveIndexedBlockHeight(block.header.height, process.env.NEAR_NETWORK_ID);
      await runBlockHandlers(block);
    } else {
      debug('Empty block');
    }

    blockRetry = 0;
    blockHeight = blockHeight + 1;

    // Ref: https://docs.near.org/docs/concepts/gas#thinking-in-gas
    setTimeout(async () => await retryGetBlockData(), pollingInterval);
  } catch (error) {
    // Not found block, or a block has no transaction.
    // e.g. https://explorer.testnet.near.org/blocks/4yzd8JgxsKY82bm3Yb7yRWwMH5xhhn6TMATk8CQBissP
    if (error.message.indexOf('DB Not Found') !== -1) {
      if (blockRetry < pollingTimeout) {
        blockRetry = blockRetry + 1;

        logger.info('near:Pending block %d, %s', blockHeight, error.message);
        return setTimeout(async () => await retryGetBlockData(), pollingRetryInterval);
      } else {
        blockRetry = 0;
        blockHeight = blockHeight + 1;

        logger.info('near:Polling timed out, skip block %d', blockHeight);
        return setTimeout(async () => await retryGetBlockData(), pollingInterval);
      }
    }

    throw error;
  }
}

async function retryGetBlockData() {
  try {
    await getBlockData();
  } catch (error) {
    logger.error('near:retryGetBlockData fails to fetch block, retry in 5 minutes: %O', error);
    setTimeout(async () => await retryGetBlockData(), 5 * 60 * 1000);
  }
}

async function getHeadBlockNumber() {
  const block = await provider.block({ finality: 'final' });
  return block.header.height;
}

async function start() {
  if (-1 === blockHeight) {
    blockHeight = await getIndexedBlockHeight(process.env.NEAR_NETWORK_ID);

    if (blockHeight > 0)
      ++ blockHeight;
  }

  const height = await getHeadBlockNumber();

  if (0 === blockHeight || blockHeight > height)
    blockHeight = height;

  logger.info('Starting NEAR block indexer at block %d...', blockHeight);
  await retryGetBlockData();
  logger.info('Started NEAR block indexer');
}

module.exports = {
  start
};
