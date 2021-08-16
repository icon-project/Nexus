'use strict';

const debug = require('debug')('icon');
const { logger, pgPool } = require('../../common');
const { v4: uuidv4 } = require('uuid');
const { IconConverter } = require('icon-sdk-js');
const { decode } = require('rlp');

const ZERO_ADDRESS = 'hx0000000000000000000000000000000000000000';
const TRANSFER_BATCH_PROTOTYPE  = 'TransferBatch(Address,Address,Address,bytes,bytes)';

async function getTokensInfo(idEncode, valueEncode) {
  const valueDecoded = decode(valueEncode);
  const idDecoded = decode(idEncode);
  const id = '0x' + idDecoded[0].toString('hex').substring(1);

  const name = await getTokenNameById(id);
  const value = IconConverter.toNumber('0x' + valueDecoded[0].toString('hex'));

  return {
    tokenValue: value,
    tokenName: name,
  }
}

async function handleMintBurnEvents(txResult, transaction) {
  if (0 === txResult.eventLogs.length || 1 !== txResult.status || TRANSFER_BATCH_PROTOTYPE !== txResult.eventLogs[0].indexed[0])
    return false;

  try {
    const eventObj = await getMintBurnEvent(txResult, transaction);

    if(!eventObj.tokenName) {
      logger.debug('handleMintBurnEvents Token not registered with Icon blockchain');
      return false;
    }

    if(ZERO_ADDRESS === txResult.eventLogs[0].indexed[2]) { // mint when _from value is ZERO
      const totalMintToken = await getTotalTokenMintAmount(eventObj.tokenName);

      await saveMintToken(eventObj, totalMintToken);
    } else if (ZERO_ADDRESS === txResult.eventLogs[0].indexed[3]) { // burn when _to value is ZERO
      const totalBurnToken = await getTotalTokenBurnAmount(eventObj.tokenName);

      await saveBurnToken(eventObj, totalBurnToken);
    } else {
      return false;
    }
  } catch (error) {
    logger.error('handleMintBurnEvents failed', { error });
    throw error;
  }
}

async function getMintBurnEvent(txResult, transaction) {
  try {
    for (let event of txResult.eventLogs) {
      if (TRANSFER_BATCH_PROTOTYPE === event.indexed[0]) {
        let token = await getTokensInfo(event.data[0], event.data[1]);

        return {
          tokenName: token.tokenName,
          tokenValue: token.tokenValue,
          txHash: txResult.txHash,
          blockHash: txResult.blockHash,
          blockHeight: txResult.blockHeight,
          blockTime: Math.floor(transaction.timestamp / 1000),
          networkId: process.env.ICON_NETWORK_ID,
        };
      }
    }
  } catch (error) {
    throw Error(`getMintBurnEvent incorrect eventLogs ${error.message}`);
  }
}

async function getTotalTokenMintAmount(name) {
  const { rows } = await pgPool.query('SELECT total_token_amount FROM minted_tokens WHERE token_name = $1 ORDER BY create_at DESC LIMIT 1', [name]);
  return rows[0] ? rows[0].total_token_amount : 0;
}

async function getTotalTokenBurnAmount(name) {
  const { rows } = await pgPool.query('SELECT total_token_amount FROM burned_tokens WHERE token_name = $1 ORDER BY create_at DESC LIMIT 1', [name]);
  return rows[0] ? rows[0].total_token_amount : 0;
}

async function getTokenNameById(id) {
  const { rows } = await pgPool.query('SELECT token_name FROM tokens_info WHERE token_id = $1', [id]);
  return rows[0] ? rows[0].token_name : false;
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
  handleMintBurnEvents,
  getMintBurnEvent
};