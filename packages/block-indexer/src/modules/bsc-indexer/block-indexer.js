'use strict';

const debug = require('debug')('bsc');
const debugTx = require('debug')('bsc_tx');
const Web3 = require('web3');
const { logger } = require('../../common');
const { buildBscEventMap } = require('../common/evmlog');
const { saveIndexedBlockHeight, getIndexedBlockHeight } = require('./repository');
const { testEventHandler } = require('./testhandler');
const { handleTokenRegister } = require('./tokens');

const web3 = new Web3(process.env.BSC_API_URL);

let blockHeight = Number(process.env.BSC_BLOCK_HEIGHT);
let isWaitToStop = false;

// from/to address of transactions need to query for receipts.
const watchedTxReceipt = {
  fromAddress: new Map([
    ['0xa6A2E181b4e981b036aB8A787A3E348ABdfcFc96', true], // my Tien test address
    ['0x61852aA6049336319Cceab16F5796Bcc64fC2348', true], // my Hoa test address
    ['0xaa25Aa7a19f9c426E07dee59b12f944f4d9f1DD3', true] // faucet address
  ]),
  toAddress: new Map([
    ['0xa6A2E181b4e981b036aB8A787A3E348ABdfcFc96', true], // my Tien test address
    ['0x61852aA6049336319Cceab16F5796Bcc64fC2348', true] // my Hoa test address
  ])
};

// All transaction handlers go here.
async function runTransactionHandlers(tx, txReceipt, block) {
  try {
    if (txReceipt && txReceipt.status) {
      // handlers need tx receipt go here.
      await testEventHandler(tx, txReceipt);
      // await handleTokenRegister(tx, txReceipt);
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

    if (watchedTxReceipt.fromAddress.has(tx.from) || watchedTxReceipt.toAddress.has(tx.to))
      await retryGetTransactionReceipt(tx, block);
    else
      await runTransactionHandlers(tx, null, block);
  }

  // More block handlers go here.
}

async function getBlockData() {
  if (!isWaitToStop) {
    // ISSUE: it requires a manual fix to work with web3 1.5.0
    // ref: https://github.com/ChainSafe/web3.js/pull/3948#issuecomment-821779691
    const block = await web3.eth.getBlock(blockHeight, true);
    const timeout = block ? 3000 : 15000; // Block time ~3 seconds, wait longer for new blocks created.

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
  const eventMap = buildBscEventMap();
  logger.info('BSC event map: %O', eventMap);

  if (-1 === blockHeight) {
    blockHeight = await getIndexedBlockHeight(process.env.BSC_NETWORK_ID);

    if (blockHeight > 0)
      ++ blockHeight;
  }

  if (0 === blockHeight) {
    blockHeight = await web3.eth.getBlockNumber();
  }

  logger.info('Starting BSC block indexer at block %d...', blockHeight);
  await retryGetBlockData();
  logger.info('Started BSC block indexer');
}

module.exports = {
  start
};
