'use strict';

const debug = require('debug')('icon');
const { IconConverter } = require('icon-sdk-js');
const { logger, pgPool } = require('../../common');
const { ICX_NUMBER } = require('./constants');

async function getTokenNameById(id) {
  return 'tokenName';
}

async function handleMintingEvents(txResult, transaction) {
  if (1 !== txResult.status || 0 === txResult.eventLogs.length || 0 !== txResult.eventLogs[0].indexed[2])
    return false;

  for (let event of txResult.eventLogs) {
    if ('TransferSingle(Address,Address,Address,int,int)' === event.indexed[0] || 0 === event.indexed[2]) {
      let name = await getTokenNameById(event.data[0]);
      
      const mintObj = {
        tokenName: name,
        tokenValue: event.data[1],
        txHash: txResult.txHash,
        blockHash: txResult.blockHash,
        blockHeight: txResult.blockHeight,
        blockTime: transaction.timestamp,
        networkId: transaction.nid.c[0],
      }

      await saveMintToken(mintObj);
    }
  }
  return true;
}

module.exports = {
    handleMintingEvents,
};
      