'use strict';

const debug = require('debug')('moonbeam');
const debugTx = require('debug')('moonbeam_tx');
const Web3 = require('web3');
const { createLogger } = require('../../common');
const { getMoonbeamEventMap } = require('../common/events');
const { saveIndexedBlockHeight, getIndexedBlockHeight } = require('../bsc-indexer/repository');
const { getRegisteredTokens } = require('../tokens/model');
const { handleRelayActions } = require('../relays/moonbeam');
const { Web3MintBurnHandler } = require('../mint-burn/web3');
const { Web3TransactionHandler } = require('../transactions/web3');

const logger = createLogger();

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
let mintBurnHandler = null;
let txHandler = null;

// All transaction handlers go here.
async function runTransactionHandlers(tx, txReceipt, block) {
  try {
    if (txReceipt && txReceipt.status) {
      // handlers need tx receipt go here.
      await txHandler.run(tx, txReceipt, block);
      await mintBurnHandler.run(tx, txReceipt, block);
      await handleRelayActions(tx, block);
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

    if (tx.to && watchedTxReceipt.toAddress.has(tx.to.toLowerCase()))
      await retryGetTransactionReceipt(tx, block);
    else
      await runTransactionHandlers(tx, null, block);
  }

  // More block handlers go here.
}

async function getBlockData() {
  // ISSUE 1: it requires a manual fix to work with web3 1.5.0
  // Error: Number can only safely store up to 53 bits
  // Open file ./node_modules/number-to-bn/node_modules/bn.js/lib/bn.js
  // Go to line 506 assert(false, 'Number can only safely store up to 53 bits');
  // Replace it with ret = Number.MAX_SAFE_INTEGER;
  // ref: https://github.com/ChainSafe/web3.js/pull/3948#issuecomment-821779691
  // ISSUE 2: Get "Error: Returned error: Expect block number from id: BlockId::Number(1577159)" if block
  // is not ready i.e. mining, importing
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
    logger.error('moonbeam:retryGetBlockData fails to fetch block, retry in 1 minutes: %O', error);
    setTimeout(async () => await retryGetBlockData(), 1 * 60 * 1000);
  }
}

async function start() {
  const eventMap = getMoonbeamEventMap(web3);
  logger.info('Moonbeam event map: %O', eventMap);

  const contractMap = await getRegisteredTokens();

  for (const [key, value] of contractMap.entries())
    watchedTxReceipt.toAddress.set(key, true);

  mintBurnHandler = new Web3MintBurnHandler({
    name: 'moonbeam',
    networkId: process.env.MOONBEAM_NETWORK_ID,
    endpointUrl: process.env.MOONBEAM_API_URL,
    bmcAddress: process.env.MOONBEAM_BMC_ADDRESS,
    eventMap,
    contractMap
  });

  txHandler = new Web3TransactionHandler({
    name: 'moonbeam',
    networkId: process.env.MOONBEAM_NETWORK_ID,
    endpointUrl: process.env.MOONBEAM_API_URL,
    bmcAddress: process.env.MOONBEAM_BMC_ADDRESS,
    eventMap,
    contractMap
  });

  if (-1 === blockHeight) {
    blockHeight = await getIndexedBlockHeight(process.env.MOONBEAM_NETWORK_ID);

    if (blockHeight > 0)
      ++ blockHeight;
  }

  const height = await web3.eth.getBlockNumber();

  if (0 === blockHeight || blockHeight > height)
    blockHeight = height;

  logger.info('Starting Moonbeam block indexer at block %d...', blockHeight);
  await retryGetBlockData();
  logger.info('Started Moonbeam block indexer');
}

module.exports = {
  start
};
