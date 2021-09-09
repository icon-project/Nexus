'use strict';

const debug = require('debug')('moonbeam');
const axios = require('axios');
const { IconConverter } = require('icon-sdk-js');
const { logger } = require('../../common');
const { saveIndexedBlockHeight, getIndexedBlockHeight } = require('../bsc-indexer/repository');
const { buildEventMap, buildBSHScoreEventMap } = require('./events');
const { handleTransactionEvents } = require('../transactions/moonbeam');
const { handleMintBurnEvents } = require('./mint-burn');
const { buildActionMap } = require('./actions');
const { handleRelayAction } = require('../relays/moonbeam');

let blockHeight = Number(process.env.MOONBEAM_BLOCK_HEIGHT);
let isWaitToStop = false;

async function runTransactionHandlers(transaction, block) {
  try {
    await handleTransactionEvents(transaction, block);
    await handleMintBurnEvents(transaction, block);
    await handleRelayAction(transaction, block);

    // More transaction handlers go here.
  } catch (error) {
    logger.error('moonbeam:runTransactionHandlers fails %O', error);
  }
}

async function runBlockHandlers(block) {
  for (const tx of block.extrinsics) {
    // Ignore timestamp transactions.
    if ('timestamp' !== tx.method.pallet) {
      debug('Transaction: %O', tx);
      await runTransactionHandlers(tx, block);
    }
  }

  // More block handlers go here.
}

async function getBlockByHeight(height) {
  try {
    const result = await axios.get(`${process.env.SIDECAR_API_URL}/blocks/${blockHeight}`, {
      headers: {
        'Content-Type': 'application/json',
      },
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
        logger.info(`Received Moonbeam block ${block.number}, ${block.hash}`);
        debug('Block: %O', block);

        await saveIndexedBlockHeight(block.number, process.env.MOONBEAM_NETWORK_ID);
        await runBlockHandlers(block);
      }

      ++blockHeight;
    }

    setTimeout(async () => await retryGetBlockData(), timeout);
  }
}

// Issue: Sidecar /blocks/head always return 0 so need to call RPC directly.
// Ref: https://git.baikal.io/btp-dashboard/pm/-/issues/233
async function getHeadBlock() {
  let result = await axios.post(
    process.env.MOONBEAM_API_URL,
    {
      id: 1,
      jsonrpc: '2.0',
      method: 'chain_getHead',
    },
    {
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );

  if (200 === result.status) {
    result = await axios.post(
      process.env.MOONBEAM_API_URL,
      {
        id: 1,
        jsonrpc: '2.0',
        method: 'chain_getBlock',
        params: [result.data.result], // head block hash
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );

    if (200 === result.status) {
      result.data.result.block.number = IconConverter.toNumber(
        result.data.result.block.header.number,
      );
      debug('Head block: %O', result.data.result.block);

      return result.data.result.block;
    }
  } else {
    throw Error(`getHeadBlock failed with status code ${result.status}`);
  }
}

async function retryGetBlockData() {
  try {
    await getBlockData();
  } catch (error) {
    logger.error('Failed to fetch Moonbeam block data, retry in 5 minutes', {
      error: error.toString(),
    });
    setTimeout(async () => await retryGetBlockData(), 5 * 60 * 1000);
  }
}

async function start() {
  const eventMap = buildEventMap();
  const eventMapBSHScore = buildBSHScoreEventMap();
  const actionMap = buildActionMap();

  logger.info('Moonbeam event map: %O', eventMap);
  logger.info('Moonbeam BSH SCORE event map: %O', eventMapBSHScore);
  logger.info('Moonbeam BMC Management action map: %O', actionMap);

  if (-1 === blockHeight) {
    blockHeight = await getIndexedBlockHeight(process.env.MOONBEAM_NETWORK_ID);

    if (blockHeight > 0)
      ++ blockHeight;
  }

  if (0 === blockHeight) {
    const block = await getHeadBlock();
    blockHeight = block.number;
  }

  logger.info('Starting Moonbeam block indexer at block %d...', blockHeight);
  await retryGetBlockData();
  logger.info('Started Moonbeam block indexer');
}

module.exports = {
  start,
};
