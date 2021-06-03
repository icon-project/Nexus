'use strict';

const debug = require('debug')('edgeware');
const axios = require('axios');
const { logger } = require('../../common');
const { saveBlock, saveTransaction } = require('./repository');

let blockHeight = Number(process.env.EDGEWARE_BLOCK_HEIGHT);
let isWaitToStop = false;

async function runTransactionHandlers(transaction, block) {
  // More transaction handlers go here.
}

async function runBlockHandlers(block) {
  for (const tx of block.extrinsics) {
    debug('Transaction: %O', tx);

    await saveTransaction(tx);
    await runTransactionHandlers(tx, block);
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
      logger.error(`getBlockByHeight ${height} failed with error ${error.response.status}`, {
        error: {
          code: error.response.data.code,
          message: error.response.data.message
        }
      });

      if (400 === error.response.status) {
        return null; // block not found, let's waiting
      }

      throw error;
    } else {
      logger.error(`getBlockByHeight ${height} failed with error: ${error.message}`);
      throw error;
    }
  }
}

async function getBlockData() {
  if (!isWaitToStop) {
    const block = await getBlockByHeight(blockHeight);

    if (block) {
      // Block always has one extrinsics of set timestamp.
      if (block.extrinsics.length > 1) {
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

async function getLastBlock() {
  const result = await axios.get(process.env.SIDECAR_API_URL + '/blocks/head', {
    headers: {
      'Content-Type': 'application/json'
    }
  });

  debug('Head block: %O', result.data);

  if (200 === result.status) {
    return result.data;
  } else {
    throw Error(`getLastBlock failed with status code ${result.status}`);
  }
}

async function start() {
  logger.info('Starting Edgeware block indexer at block %d...', blockHeight);

  if (blockHeight < 0) {
    const block = await getLastBlock();
    blockHeight = Number(block.number);
  }

  await getBlockData();

  logger.info('Started Edgeware block indexer');
}

module.exports = {
  start
};
