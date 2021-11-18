'use strict';

const debug = require('debug')('bsc');
const debugTx = require('debug')('bsc_tx');
const Web3 = require('web3');
const { logger } = require('../../common');
const { getBscEventMap } = require('../common/events');
const { getBscActionMap } = require('../common/actions');
const { saveIndexedBlockHeight, getIndexedBlockHeight } = require('./repository');
const { getTokenContractMap } = require('../transactions/model');
const { handleTransactionEvents } = require('../transactions/bsc');
const { handleMintBurnEvents } = require('./mint-burn');
const { handleRelayActions } = require('../relays/bsc');

// from/to address of transactions need to query for receipts.
const watchedTxReceipt = {
  fromAddress: new Map([
    ['0xaa25Aa7a19f9c426E07dee59b12f944f4d9f1DD3', true] // e.g. faucet address
  ]),
  toAddress: new Map([
    [process.env.BSC_BMC_ADDRESS.toLowerCase(), true],
    [process.env.BSC_BMC_PERIPHERY_ADDRESS.toLowerCase(), true]
  ])
};

const web3 = new Web3(process.env.BSC_API_URL);
let blockHeight = Number(process.env.BSC_BLOCK_HEIGHT);

// All transaction handlers go here.
async function runTransactionHandlers(tx, txReceipt, block) {
  try {
    if (txReceipt && txReceipt.status) {
      // handlers need tx receipt go here.
      await handleTransactionEvents(tx, txReceipt, block);
      await handleMintBurnEvents(tx, txReceipt);
      await handleRelayActions(tx, txReceipt, block);
    } else {
      // handlers don't need tx receipt go here.
    }
  } catch (error) {
    logger.error('bsc:runTransactionHandlers fails %O', error);
  }
}

async function retryGetTransactionReceipt(tx, block) {
  const receipt = await web3.eth.getTransactionReceipt(tx.hash);

  if (receipt) {
    debugTx('Transaction receipt: %O', receipt);
    await runTransactionHandlers(tx, receipt, block);
  } else {
    setTimeout(async () => await retryGetTransactionReceipt(tx, block), 5000);
  }
}

async function runBlockHandlers(block) {
  for (const tx of block.transactions) {
    debugTx('Transaction: %O', tx);

    if ((tx.to && watchedTxReceipt.toAddress.has(tx.to.toLowerCase())) || watchedTxReceipt.fromAddress.has(tx.from.toLowerCase()))
      await retryGetTransactionReceipt(tx, block);
    else
      await runTransactionHandlers(tx, null, block);
  }

  // More block handlers go here.
}

async function getBlockData() {
  // ISSUE: it requires a manual fix to work with web3 1.5.0
  // ref: https://github.com/ChainSafe/web3.js/pull/3948#issuecomment-821779691
  const block = await web3.eth.getBlock(blockHeight, true);
  const timeout = block ? 3000 : 10000; // Block time ~3 seconds, wait longer for new blocks created.

  if (block) {
    if (block.transactions.length > 0) {
      logger.info(`Received BSC block ${block.number}, ${block.hash}`);
      debug('Block: %O', block);

      await saveIndexedBlockHeight(block.number, process.env.BSC_NETWORK_ID);
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
    logger.error('Failed to fetch BSC block data, retry in 5 minutes: %O', error);
    setTimeout(async () => await retryGetBlockData(), 5 * 60 * 1000);
  }
}

async function start() {
  const eventMap = getBscEventMap(web3);
  logger.info('BSC event map: %O', eventMap);

  const actionMap = getBscActionMap(web3);
  logger.info('BSC action map: %O', actionMap);

  const contractMap = await getTokenContractMap();
  logger.info('BSC registered tokens: %O', contractMap);

  for (const [key, value] of contractMap.entries())
    watchedTxReceipt.toAddress.set(key, value);

  if (-1 === blockHeight) {
    blockHeight = await getIndexedBlockHeight(process.env.BSC_NETWORK_ID);

    if (blockHeight > 0)
      ++ blockHeight;
  }

  if (0 === blockHeight)
    blockHeight = await web3.eth.getBlockNumber();

  logger.info('Starting BSC block indexer at block %d...', blockHeight);
  await retryGetBlockData();
  logger.info('Started BSC block indexer');
}

module.exports = {
  start
};
