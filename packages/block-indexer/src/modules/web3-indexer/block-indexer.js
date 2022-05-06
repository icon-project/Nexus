'use strict';

const debug = require('debug')('web3-block-indexer');
const debugTx = require('debug')('web3-tx');
const { createLogger } = require('../../common');
const { saveIndexedBlockHeight, getIndexedBlockHeight } = require('../bsc-indexer/repository');
const { getRegisteredTokens } = require('../tokens/model');
const { Web3MintBurnHandler } = require('../mint-burn/web3');
const { Web3TransactionHandler } = require('../transactions/web3');
const { Web3TokenRegisterHandler } = require('../tokens/web3');
const { Web3RelayHandler } = require('../relays/web3');

const logger = createLogger();

class Web3BlockIndexer {
  constructor(config, eventMap, actionMap, web3) {
    this.blockHeight = config.blockHeight;
    this.config = { ...config };
    this.web3 = web3;
    this.networkName = config.networkName;
    logger.info(`${config.networkName} event map: %O`, eventMap);
    logger.info(`${config.networkName} map: %O`, actionMap);

    this.mintBurnHandler = new Web3MintBurnHandler(this.config, eventMap, web3);
    this.txHandler = new Web3TransactionHandler(this.config, eventMap, web3);
    this.tokenHandler = new Web3TokenRegisterHandler(this.config, actionMap, web3);
    this.relayHandler = new Web3RelayHandler(this.config, actionMap, web3);
  }

  // All transaction handlers go here.
  async runTransactionHandlers(tx, txReceipt, block) {
    try {
      if (txReceipt && txReceipt.status) {
        // handlers need tx receipt go here.
        await this.txHandler.run(tx, txReceipt, block);
        await this.mintBurnHandler.run(tx, txReceipt, block);
        await this.tokenHandler.run(tx, txReceipt, block);
        await this.relayHandler.run(tx, txReceipt, block);
      } else {
        // handlers don't need tx receipt go here.
      }
    } catch (error) {
      logger.error(`${this.networkName}:runTransactionHandlers fails %O`, error);
    }
  }

  async retryGetTransactionReceipt(tx, block) {
    const receipt = await this.web3.eth.getTransactionReceipt(tx.hash);

    if (receipt) {
      debugTx('Transaction receipt: %O', receipt);
      await this.runTransactionHandlers(tx, receipt, block);
    } else {
      setTimeout(async () => await this.retryGetTransactionReceipt(tx, block), 5000);
    }
  }

  async runBlockHandlers(block) {
    for (const tx of block.transactions) {
      debugTx('Transaction: %O', tx);

      if (tx.to) {
        const tokenMap = await getRegisteredTokens();

        if (this.config.bmcAddress === tx.to || this.config.bmcManagementAddress === tx.to ||
          tokenMap.has(tx.to.toLowerCase())) {
          await this.retryGetTransactionReceipt(tx, block);
        } else {
          await this.runTransactionHandlers(tx, null, block);
        }
      }
    }

    // More block handlers go here.
  }

  async getBlockData() {
    // ISSUE 1: it requires a manual fix to work with web3 1.5.0
    // Error: Number can only safely store up to 53 bits
    // Open file ./node_modules/number-to-bn/node_modules/bn.js/lib/bn.js
    // Go to line 506 assert(false, 'Number can only safely store up to 53 bits');
    // Replace it with ret = Number.MAX_SAFE_INTEGER;
    // ref: https://github.com/ChainSafe/web3.js/pull/3948#issuecomment-821779691
    const block = await this.web3.eth.getBlock(this.blockHeight, true);
    const timeout = block ? 0 : 3000; // Block time ~3 seconds, wait longer for new blocks created.

    if (block) {
      if (block.transactions.length > 0) {
        logger.info(`${this.networkName}:getBlockData received block ${block.number}, ${block.hash}`);
        debug('Block: %O', block);

        await saveIndexedBlockHeight(block.number, this.config.networkId);
        await this.runBlockHandlers(block);
      }

      ++this.blockHeight;
    }

    setTimeout(async () => await this.retryGetBlockData(), timeout);
  }

  async retryGetBlockData() {
    try {
      await this.getBlockData();
    } catch (error) {
      // Bad error.message if block isn't available: Error: Returned error: Expect block number from id: BlockId::Number(1577159)
      // is not ready i.e. mining, importing
      if (error.message.indexOf('Expect block number from id') > 0) {
        logger.info(`Block ${this.blockHeight} is not available. Waiting for a few seconds.`);
        setTimeout(async () => await this.retryGetBlockData(), 3 * 1000);
        return true;
      }

      logger.error(`${this.networkName}:retryGetBlockData fails to fetch block, retry in 3 seconds: %O`, error);
      setTimeout(async () => await this.retryGetBlockData(), 3 * 1000);
    }
  }

  async start() {
    if (this.blockHeight === -1) {
      this.blockHeight = await getIndexedBlockHeight(this.config.networkId);

      if (this.blockHeight > 0) { this.blockHeight++; }
    }

    const height = await this.web3.eth.getBlockNumber();

    if (this.blockHeight === 0 || this.blockHeight > height) { this.blockHeight = height; }

    logger.info(`Starting ${this.networkName} block indexer at block %d...`, this.blockHeight);
    await this.retryGetBlockData();
    logger.info(`Started ${this.networkName} block indexer`);
  }
}

module.exports = {
  Web3BlockIndexer
};
