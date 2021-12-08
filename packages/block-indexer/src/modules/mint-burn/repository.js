'use strict';

const { createLogger, pgPool } = require('../../common');
const { v4: uuidv4 } = require('uuid');

const MINT = 'mint';
const BURN = 'burn';
const logger = createLogger();

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
  saveToken,
  getTotalTokenAmount
};
