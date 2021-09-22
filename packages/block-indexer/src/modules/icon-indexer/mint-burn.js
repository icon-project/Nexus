'use strict';

const debug = require('debug')('icon');
const { logger, ICX_LOOP_UNIT, pgPool } = require('../../common');
const { v4: uuidv4 } = require('uuid');
const { IconConverter } = require('icon-sdk-js');
const { decode } = require('rlp');

const ZERO_ADDRESS = 'hx0000000000000000000000000000000000000000';
const TRANSFER_BATCH_PROTOTYPE = 'TransferBatch(Address,Address,Address,bytes,bytes)';
const MINT = 'mint';
const BURN = 'burn';

async function getTokensInfo(idEncode, valueEncode) {
  const valueDecoded = decode(valueEncode);
  const idDecoded = decode(idEncode);
  const id = '0x' + idDecoded[0].toString('hex').substring(1);

  const name = await getTokenNameById(id);
  const value = IconConverter.toNumber('0x' + valueDecoded[0].toString('hex'));

  return {
    tokenValue: value,
    tokenName: name,
    tokenId: id,
  };
}

async function handleMintBurnEvents(txResult, transaction) {
  if (
    0 === txResult.eventLogs.length ||
    1 !== txResult.status ||
    TRANSFER_BATCH_PROTOTYPE !== txResult.eventLogs[0].indexed[0]
  )
    return false;

  try {
    const eventObj = await getMintBurnEvent(txResult, transaction);

    if (!eventObj.tokenName) {
      logger.debug('handleMintBurnEvents Token not registered with Icon blockchain');
      return false;
    }

    if (ZERO_ADDRESS === txResult.eventLogs[0].indexed[2]) {
      // mint when _from value is ZERO
      const totalMintToken = await getTotalTokenAmount(eventObj.tokenName, MINT);

      await saveToken(eventObj, totalMintToken, MINT);
    } else if (ZERO_ADDRESS === txResult.eventLogs[0].indexed[3]) {
      // burn when _to value is ZERO
      const totalBurnToken = await getTotalTokenAmount(eventObj.tokenName, BURN);

      await saveToken(eventObj, totalBurnToken, BURN);
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
          tokenId: token.tokenId,
          tokenValue: Number(token.tokenValue) / ICX_LOOP_UNIT,
          to: event.indexed[3],
          from: event.indexed[2],
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

async function getTotalTokenAmount(tokenName, tokenType) {
  try {
    let tableName = 'minted_tokens';
    if (BURN == tokenType) {
      tableName = 'burned_tokens';
    }
    const {
      rows,
    } = await pgPool.query(
      `SELECT total_token_amount FROM ${tableName} WHERE token_name = $1 ORDER BY create_at DESC LIMIT 1`,
      [tokenName],
    );
    return rows[0] ? Number(rows[0].total_token_amount) : 0;
  } catch (error) {
    logger.error(`getTotalTokenAmount failed get ${tokenType} value`, { error });
  }
}

async function getTokenNameById(id) {
  const { rows } = await pgPool.query('SELECT token_name FROM token_info WHERE token_id = $1', [
    id,
  ]);
  return rows[0] ? rows[0].token_name : false;
}

async function saveToken(object, totalToken, tokenType) {
  try {
    preSave(object);

    let tableName = 'minted_tokens';
    let dymamicColumn = 'mint_to';

    if (BURN == tokenType) {
      tableName = 'burned_tokens';
      dymamicColumn = 'burn_from';
    }

    const totalTokenAmount = totalToken + object.tokenValue;
    const query = `
    INSERT INTO ${tableName} (id, network_id, token_name, token_value, total_token_amount, block_time, tx_hash, token_id, ${dymamicColumn}, create_at)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW())`;
    const values = [
      object.id,
      object.networkId,
      object.tokenName,
      object.tokenValue,
      totalTokenAmount,
      object.blockTime,
      object.txHash,
      object.tokenId,
      object.to,
    ];

    await pgPool.query(query, values);
  } catch (error) {
    logger.error(`saveToken failed save ${tokenType} value`, { error });
  }
}

/**
 * Pre-save mint/burn object
 * @param {*} data
 */
function preSave(data) {
  if (!data.id) {
    data.id = uuidv4();
  }
}

module.exports = {
  handleMintBurnEvents,
  getMintBurnEvent,
};
