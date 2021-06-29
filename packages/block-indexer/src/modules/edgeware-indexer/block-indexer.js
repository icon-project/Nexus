'use strict';

const debug = require('debug')('edgeware');
const axios = require('axios');
const { logger } = require('../../common');
const { saveBlock, saveTransaction, getLastSavedBlock } = require('./repository');

let blockHeight = Number(process.env.EDGEWARE_BLOCK_HEIGHT);
let isWaitToStop = false;

async function runTransactionHandlers(transaction, block) {
  // More transaction handlers go here.
}

async function runBlockHandlers(block) {
  for (const tx of block.extrinsics) {
    // Ignore timestamp transactions.
    if ('timestamp' !== tx.method.pallet) {
      debug('Transaction: %O', tx);

      await saveTransaction(tx);
      await runTransactionHandlers(tx, block);
    }
  }

  // More block handlers go here.
}

async function getBlockByHeight(height) {
  try {
    const result = await axios.get(`${process.env.SIDECAR_API_URL}/blocks/${blockHeight}`, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    return result.data;
  } catch (error) {
    if (error.response) {
      if (400 === error.response.status) {
        debug(`Block height ${height} not found`);
        return null; // block not found, let's waiting
      }

      throw error.response.data.message;
    } else {
      throw error;
    }
  }
}

async function getBlockData() {
  if (!isWaitToStop) {
    const block = await getBlockByHeight(blockHeight);
    const timeout = block ? 1000 : 15000; // Wait longer for new blocks created.

    if (block) {
      // Block always has one extrinsics of set timestamp.
      if (block.extrinsics.length > 1) {
        debug('Block: %O', block);

        await saveBlock(block);
        await runBlockHandlers(block);
      }

      ++ blockHeight;
    }

    setTimeout(async () => await retryGetBlockData(), timeout);
  }
}

async function getHeadBlock() {
  const result = await axios.get(process.env.SIDECAR_API_URL + '/blocks/head', {
    headers: {
      'Content-Type': 'application/json'
    }
  });

  debug('Head block: %O', result.data);

  if (200 === result.status) {
    return result.data;
  } else {
    throw Error(`getHeadBlock failed with status code ${result.status}`);
  }
}

async function retryGetBlockData() {
  try {
    await getBlockData();
  } catch (error) {
    logger.error('Failed to fetch Edgeware block data, retry in 5 minutes', { error });
    setTimeout(async () => await retryGetBlockData(), 5 * 60 * 1000);
  }
}

async function start() {
  if (-1 === blockHeight) {
    const block = await getLastSavedBlock();

    if (block)
      blockHeight = Number(block.number) + 1;
    else
      blockHeight = 0;
  }

  if (0 === blockHeight) {
    const block = await getHeadBlock();
    blockHeight = Number(block.number);
  }

  logger.info('Starting Edgeware block indexer at block %d...', blockHeight);
  await retryGetBlockData();
  logger.info('Started Edgeware block indexer');
}

module.exports = {
  start
};
