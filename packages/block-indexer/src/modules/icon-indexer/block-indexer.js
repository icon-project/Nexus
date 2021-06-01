'use strict';

const debug = require('debug')('icon');
const IconService = require('icon-sdk-js');
const { HttpProvider } = require('icon-sdk-js');
const { logger, pgPool } = require('../../common');
const { TBL_NAME, ABP_FAS } = require('../../common/constants');

const { saveBlock, saveTransaction } = require('./repository');

const httpProvider = new HttpProvider(process.env.ICON_API_URL);
const iconService = new IconService(httpProvider);

let blockHeight = Number(process.env.ICON_BLOCK_HEIGHT);
let isWaitToStop = false;

async function runTransactionHandlers(transaction, txResult, block) {
  // More transaction handlers go here.
}

async function getTransactionResult(txHash) {
  const result = await iconService.getTransactionResult(txHash).execute();
  return result;
}

async function runBlockHandlers(block) {
  for (const tx of block.confirmedTransactionList) {
    debug('Transaction: %O', tx);

    const result = await getTransactionResult(tx.txHash);
    debug('Transaction result: %O', result);

    await saveTransaction(tx, result);
    await runTransactionHandlers(tx, result, block);
    try {
    await runFASHandler(tx);
    } catch(e){
      debug('Block errrorror====== %s', e);
      return e;
    }
  }

  // More block handlers go here.
}

async function getBlockByHeight(height) {
  try {
    const block = await iconService.getBlockByHeight(height).execute();
    return block;
  } catch (error) {
    debug('Block height %d: %s', height, error);

    if ('[RPC ERROR] E1005:Not found' === error)
      return null;
    else
      throw error;
  }
}

async function getBlockData() {
  if (!isWaitToStop) {
    const block = await getBlockByHeight(blockHeight);

    if (block) {
      if (block.confirmedTransactionList.length > 0) {
        debug('Block: %O', block);

        await saveBlock(block);
        await runBlockHandlers(block);
      }

      ++ blockHeight;
      setTimeout(async () => await getBlockData(), 1000);
    } else {
      // Wait longer for new blocks created.
      setTimeout(async () => await getBlockData(), 5000);
    }
  }
}
function propsAsString(object) {
  return Object.keys(object).map(function (key) { return `"${object[key]}"`; }).join(', ');
}
function propsCountValueString(object) {
  return Object.keys(object).map(function (key, index) { return `$${index + 1}`; }).join(', ');
}

async function runFASHandler(tx) { 
  
  try {
    if (tx.data.method == 'transfer' && tx.dataType == 'call' &&
    tx.data.params._to == process.env.FEE_AGGREGATION_SCORE_ADDRESS) {
      const client = await pgPool.connect();
      const insertDealer = `INSERT INTO public.transfer_fees(id, value, name, receive_at) VALUES ($1, $2, $3, $4})`;
      await client.query(insertDealer,  [tx.from, tx.data.params._value, tx.to, tx.timestamp]);
      debug('Param value: %O', tx.data.params)
    }
  } catch(e) {
      throw e;
  }
}

async function start() {
  logger.info('Starting ICON block indexer at block %d...', blockHeight);

  if (blockHeight < 0) {
    const block = await iconService.getLastBlock().execute();
    blockHeight = block.height;
  }

  await getBlockData();

  logger.info('Started ICON block indexer');
}

module.exports = {
  start
};
