'use strict';

const debug = require('debug')('icon');
const { logger, pgPool } = require('../../common');
const { v4: uuidv4 } = require('uuid');
const { hexToIcxUnit } = require('../../common/util');

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
  if (1 !== txResult.status || 0 === txResult.eventLogs.length ||
     (TRANSFER_SINGLE_PROTOTYPE !== txResult.eventLogs[0].indexed[0] && TRANSFER_BATCH_PROTOTYPE !== txResult.eventLogs[0].indexed[0]))
    return false;

  try {
    const eventObj = await getMintBurnEvent(txResult, transaction);

    if('0x0' === txResult.eventLogs[0].indexed[2]) { // mint when _from value is ZERO
      const totalMintToken = await getTotalTokenMintAmount(eventObj.tokenName);

      await saveMintToken(eventObj, totalMintToken);
    } else if ('0x0' === txResult.eventLogs[0].indexed[3]) { // burn when _to value is ZERO
      const totalBurnToken = await getTotalTokenBurnAmount(eventObj.tokenName);

      await saveBurnToken(eventObj, totalBurnToken);
    } else {
      return false;
    }
  } catch (error) {
    logger.error('handleMintEvents failed', { error });
    throw error;
  }
}

async function getMintBurnEvent(txResult, transaction) {
  try {
    let results = [];
    for (let event of txResult.eventLogs) {
      if (TRANSFER_SINGLE_PROTOTYPE === event.indexed[0] && '0' === event.indexed[2]) {
        let name = getTokenNameById(event.data[0]);
        let value = hexToIcxUnit(event.data[1]);

        results.push(getEventData(name, value, txResult.txHash, txResult.blockHash, txResult.blockHeight, Math.floor(transaction.timestamp / 1000), transaction.nid.c[0]));

        debug('Get tokens info: %O', results);
        return results;
      } else if (TRANSFER_BATCH_PROTOTYPE === event.indexed[0] && '0' === event.indexed[2]) {
        let tokens = getTokensInfo(event.data[0], event.data[1]);

        for (let item of tokens) {
          results.push(getEventData(item.name, item.value, txResult.txHash, txResult.blockHash, txResult.blockHeight, Math.floor(transaction.timestamp / 1000), transaction.nid.c[0]));
        }

        debug('Get tokens info: %O', results);
        return results;
      }
    }
  } catch (error) {
    throw Error(`getMintEvent incorrect eventLogs ${error.message}`);
  }
}

function getEventData(name, value, txHash, blockHash, blockHeight, blockTime, networkId) {
  return {
    tokenName: name,
    tokenValue: value,
    txHash: txHash,
    blockHash: blockHash,
    blockHeight: blockHeight,
    blockTime: blockTime,
    networkId: networkId,
  };
}

async function getTotalTokenMintAmount(name) {
  const { rows } = await pgPool.query(`SELECT total_token_amount FROM minted_tokens WHERE token_name = ${name} ORDER BY create_at DESC LIMIT 1`);
  return rows[0] ? rows[0].total_token_amount : 0;
}

async function getTotalTokenBurnAmount(name) {
  const { rows } = await pgPool.query(`SELECT total_token_amount FROM burned_tokens WHERE token_name = ${name} ORDER BY create_at DESC LIMIT 1`);
  return rows[0] ? rows[0].total_token_amount : 0;
}

async function saveMintToken(mintObj, totalToken) {
  try {
    preSave(mintObj);

    const totalTokenAmount = totalToken + mintObj.tokenValue;
    const query = 'INSERT INTO minted_tokens (id, network_id, token_name, token_value, total_token_amount, block_time, block_height, block_hash, tx_hash, create_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW())';
    const values = [mintObj.id, mintObj.networkId, mintObj.tokenName, mintObj.tokenValue, totalTokenAmount, mintObj.blockTime, mintObj.blockHeight , mintObj.blockHash , mintObj.txHash];

    await pgPool.query(query, values);
  } catch (error) {
    logger.error('saveMintToken failed save mint value', { error });
  }
}

async function saveBurnToken(burnObj, totalToken) {
  try {
    preSave(burnObj);

    const totalTokenAmount = totalToken + burnObj.tokenValue;
    const query = 'INSERT INTO burned_tokens (id, network_id, token_name, token_value, total_token_amount, block_time, block_height, block_hash, tx_hash, create_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW())';
    const values = [burnObj.id, burnObj.networkId, burnObj.tokenName, burnObj.tokenValue, totalTokenAmount, burnObj.blockTime, burnObj.blockHeight , burnObj.blockHash , burnObj.txHash];

    await pgPool.query(query, values);
  } catch (error) {
    logger.error('saveBurnToken failed save mint value', { error });
  }
}

/**
 * Pre-save mint/burn object
 * @param {*} data
 */
function preSave(data) {
  if (!data.id) {
    data.id = uuidv4();
    data.createAt = Math.floor(new Date().getTime());
  }
}

module.exports = {
  handleMintEvents,
  getMintBurnEvent
};