'use strict';

const debug = require('debug')('icon');
const { logger, pgPool } = require('../../common');
const { v4: uuidv4 } = require('uuid');
const { hexToIcxUnit } = require('../../common/util');

// TODO: will be decode token _id from eventlog to get name of token
function getTokenNameById(id) {
  return 'tokenName';
}

async function handleMintEvents(txResult, transaction) {
  if (1 !== txResult.status || 0 === txResult.eventLogs.length || '0x0' !== txResult.eventLogs[0].indexed[2])
    return false;

  try {
    const mintObj =  getMintEvent(txResult, transaction);
    await saveMintToken(mintObj);

  } catch(error) {
    logger.error('handleMintEvents failed', { error });
    throw error;
  }
}

function getMintEvent(txResult, transaction) {
  try {
    for (let event of txResult.eventLogs) {
      if ('TransferSingle(Address,Address,Address,int,int)' === event.indexed[0] || 0 === event.indexed[2]) {
        let name = getTokenNameById(event.data[0]);
        let value = hexToIcxUnit(event.data[1]);

        const mintObj = {
          tokenName: name,
          tokenValue: value,
          txHash: txResult.txHash,
          blockHash: txResult.blockHash,
          blockHeight: txResult.blockHeight,
          blockTime: transaction.timestamp,
          networkId: transaction.nid.c[0],
        };

        debug('Get token minted: %O', mintObj);
        return mintObj;
      }
    }
  } catch (error) {
    throw Error(`Incorrect eventLogs token mint ${error.message}`);
  }
}

async function saveMintToken(mintObj) {
  try {
    preSave(mintObj);

    const query = 'INSERT INTO minted_tokens (id, network_id, token_name, token_value, block_time, block_height, block_hash, tx_hash, create_at, update_at, delete_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)';
    const values = [mintObj.id, mintObj.networkId, mintObj.tokenName, mintObj.tokenValue, mintObj.blockTime, mintObj.blockHeight , mintObj.blockHash , mintObj.txHash , mintObj.createAt, mintObj.updateAt,mintObj.deleteAt];

    await pgPool.query(query, values);
  } catch (error) {
    logger.error('saveMintToken failed save mint value', { error });
  }
}

/**
 * Pre-save mint/burn object
 * @param {*} data
 */
function preSave(data) {
  if (!data.id) {
    data.id = uuidv4();
    data.createAt = Math.floor(new Date().getTime() / 1000);
  }
  data.updateAt = Math.floor(new Date().getTime() / 1000);
  data.deleteAt = 0;
}

module.exports = {
  handleMintEvents,
  getMintEvent
};