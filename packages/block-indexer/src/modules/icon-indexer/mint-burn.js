'use strict';

const debug = require('debug')('icon');
const { logger, pgPool } = require('../../common');
const { v4: uuidv4 } = require('uuid');
const { hexToIcxUnit, getCurrentTimestamp } = require('../../common/util');

const TRANSFER_SINGLE_PROTOTYPE  = 'TransferSingle(Address,Address,Address,int,int)';
const TRANSFER_BATCH_PROTOTYPE  = 'TransferBatch(Address,Address,Address,bytes,bytes)';

// TODOs: will be decode token id from eventlog to get name of token
function getTokenNameById(id) {
  return 'NEAR';
}

// TODOs: will be decode token ids and token values from bytes data
function getTokensInfo(ids, values) {
  return [{name: 'DOT', value: 100}, {name: 'BNB', value: 200}];
}

async function handleMintEvents(txResult, transaction) {
  if (1 !== txResult.status || 0 === txResult.eventLogs.length || '0x0' !== txResult.eventLogs[0].indexed[2])
    return false;

  try {
    const mintObj = await getMintEvent(txResult, transaction);
    await saveMintToken(mintObj);

  } catch (error) {
    logger.error('handleMintEvents failed', { error });
    throw error;
  }
}

async function getMintEvent(txResult, transaction) {
  try {
    let results = [];
    for (let event of txResult.eventLogs) {
      if (TRANSFER_SINGLE_PROTOTYPE === event.indexed[0] && '0' === event.indexed[2]) {
        let name = getTokenNameById(event.data[0]);
        let value = hexToIcxUnit(event.data[1]);

        results.push({
          tokenName: name,
          tokenValue: value,
          txHash: txResult.txHash,
          blockHash: txResult.blockHash,
          blockHeight: txResult.blockHeight,
          blockTime: Math.floor(transaction.timestamp / 1000),
          networkId: transaction.nid.c[0],
        });

        debug('Get token minted: %O', results);
        return results;
      } else if (TRANSFER_BATCH_PROTOTYPE === event.indexed[0] && '0' === event.indexed[2]) {
        let tokens = getTokensInfo(event.data[0], event.data[1]);

        for (let item of tokens) {
          results.push({
            tokenName: item.name,
            tokenValue: item.value,
            txHash: txResult.txHash,
            blockHash: txResult.blockHash,
            blockHeight: txResult.blockHeight,
            blockTime: Math.floor(transaction.timestamp / 1000),
            networkId: transaction.nid.c[0],
          });
        }

        debug('Get tokens minted: %O', results);
        return results;
      }
    }
  } catch (error) {
    throw Error(`getMintEvent incorrect eventLogs ${error.message}`);
  }
}

async function saveMintToken(mintObj) {
  try {
    preSave(mintObj);

    const { rows } = await pgPool.query(`SELECT total_token_amount FROM minted_tokens WHERE token_name = ${mintObj.tokenName} ORDER BY create_at DESC LIMIT 1`);

    const totalTokenAmount = rows[0] ? (rows[0].total_token_amount + mintObj.tokenValue) : 0;

    const query = 'INSERT INTO minted_tokens (id, network_id, token_name, token_value, total_token_amount, block_time, block_height, block_hash, tx_hash, create_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW())';
    const values = [mintObj.id, mintObj.networkId, mintObj.tokenName, mintObj.tokenValue, totalTokenAmount, mintObj.blockTime, mintObj.blockHeight , mintObj.blockHash , mintObj.txHash];

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
    data.createAt = getCurrentTimestamp();
  }
}

module.exports = {
  handleMintEvents,
  getMintEvent
};