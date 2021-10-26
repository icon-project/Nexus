'use strict';

const debug = require('debug')('bsc_tx');
const Web3 = require('web3');

const bmcAddress = process.env.BSC_BMC_ADDRESS.toLowerCase();

async function handleRelayActions(tx, txReceipt, block) {
  if (bmcAddress !== tx.to.toLowerCase())
    return false;

  debug('BMC transaction: %O', tx);

  // const addRelayAction = getAddRelayAction(tx);
}

module.exports = {
  handleRelayActions
};
