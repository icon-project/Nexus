'use strict';

const debug = require('debug')('moonbeam');
const debugTx = require('debug')('moonbeam_tx');
const Web3 = require('web3');
const { logger } = require('../../common');
const { getMoonbeamEventMap } = require('../common/events');
const { saveIndexedBlockHeight, getIndexedBlockHeight } = require('../bsc-indexer/repository');
const { getTokenContractMap } = require('../transactions/model');
const { handleTransactionEvents } = require('../transactions/moonbeam');
const { handleMintBurnEvents } = require('../mint-burn/moonbeam');

// from/to address of transactions need to query for receipts.
const watchedTxReceipt = {
  fromAddress: new Map(),
  toAddress: new Map([
    [process.env.MOONBEAM_BMC_ADDRESS.toLowerCase(), true],
    [process.env.MOONBEAM_BMC_MANAGEMENT_ADDRESS.toLowerCase(), true]
  ])
};

const web3 = new Web3(process.env.MOONBEAM_API_URL);
let blockHeight = Number(process.env.MOONBEAM_BLOCK_HEIGHT);

// All transaction handlers go here.
async function runTransactionHandlers(tx, txReceipt, block) {
  try {
    if (txReceipt && txReceipt.status) {
      // handlers need tx receipt go here.
      await handleTransactionEvents(tx, txReceipt, block);
      await handleMintBurnEvents(tx, txReceipt, block);
    } else {
      // handlers don't need tx receipt go here.
    }
  } catch (error) {
    logger.error('moonbeam:runTransactionHandlers fails %O', error);
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
  const block = await web3.eth.getBlock(blockHeight, true);
  const timeout = block ? 3000 : 10000; // Block time ~3 seconds, wait longer for new blocks created.

  if (block) {
    if (block.transactions.length > 0) {
      logger.info(`moonbeam:getBlockData received block ${block.number}, ${block.hash}`);
      debug('Block: %O', block);

      await saveIndexedBlockHeight(block.number, process.env.MOONBEAM_NETWORK_ID);
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
    logger.error('moonbeam:retryGetBlockData fails to fetch block, retry in 5 minutes: %O', error);
    setTimeout(async () => await retryGetBlockData(), 5 * 60 * 1000);
  }
}

async function start() {
  const eventMap = getMoonbeamEventMap(web3);
  logger.info('Moonbeam event map: %O', eventMap);

  const contractMap = await getTokenContractMap();
  logger.info('Moonbeam registered tokens: %O', contractMap);

  for (const [key, value] of contractMap.entries())
    watchedTxReceipt.toAddress.set(key, value);

  if (-1 === blockHeight) {
    blockHeight = await getIndexedBlockHeight(process.env.MOONBEAM_NETWORK_ID);

    if (blockHeight > 0)
      ++ blockHeight;
  }

  if (0 === blockHeight)
    blockHeight = await web3.eth.getBlockNumber();

  logger.info('Starting Moonbeam block indexer at block %d...', blockHeight);
  await retryGetBlockData();
  logger.info('Started Moonbeam block indexer');
}

module.exports = {
  start
};
