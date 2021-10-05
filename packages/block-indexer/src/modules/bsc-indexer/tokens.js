'use strict';

const debug = require('debug')('bsc');
const { logger } = require('../../common');
const { saveTokenInfo } = require('./repository');
const { updateTokenContractMap } = require('../transactions/model');

async function handleTokenRegister(transaction, txReceipt) {
  // ERC20 tokens
  if ('register' === transaction.data.method) {
    debug('Found token register on %s', transaction.txHash);
    await registerERC20Token(transaction);
  }
}

async function registerERC20Token(transaction) {
}

module.exports = {
  handleTokenRegister
};
