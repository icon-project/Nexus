'use strict';

const { logger, pgPool } = require('../../common');
const { v4: uuidv4 } = require('uuid');

async function saveBlock(block) {
  try {
    const query = 'INSERT INTO moonbeam_blocks (block_hash, block_height, block_data, created_time) VALUES ($1, $2, $3, NOW())';
    const values = [block.hash, Number(block.number), JSON.stringify(block)];

    await pgPool.query(query, values);
  } catch (error) {
    logger.error(`saveBlock fails with block ${block.number}`, { error });
  }
}

async function getLastSavedBlock() {
  try {
    const query = 'SELECT * FROM moonbeam_blocks ORDER BY block_height DESC LIMIT 1';
    const { rows } = await pgPool.query(query);

    if (rows[0]) {
      return JSON.parse(rows[0].block_data);
    }
  } catch (error) {
    logger.error('getLastSavedBlock fails', { error });
  }
}

async function saveMintEvent(mintObj, totalToken) {
  preSave(mintObj);

  const totalTokenAmount = totalToken + mintObj.tokenValue;
  const query = 'INSERT INTO minted_tokens (id, network_id, token_name, token_value, total_token_amount, block_time, tx_hash, mint_to, token_id, create_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW())';
  const values = [mintObj.id, process.env.MOONBEAM_NETWORK_ID, mintObj.tokenName, mintObj.tokenValue, totalTokenAmount, mintObj.blockTime, mintObj.txHash, mintObj.to, mintObj.tokenId];

  await pgPool.query(query, values);
}

async function saveBurnEvent(burnObj, totalToken) {
  preSave(burnObj);

  const totalTokenAmount = totalToken + burnObj.tokenValue;
  const query = 'INSERT INTO burned_tokens (id, network_id, token_name, token_value, total_token_amount, block_time, tx_hash, burn_from, token_id, create_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW())';
  const values = [burnObj.id, process.env.MOONBEAM_NETWORK_ID, burnObj.tokenName, burnObj.tokenValue, totalTokenAmount, burnObj.blockTime, burnObj.txHash, burnObj.from, burnObj.tokenId];

  await pgPool.query(query, values);
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

async function getTotalTokenMinted(name) {
  const { rows } = await pgPool.query('SELECT total_token_amount FROM minted_tokens WHERE token_name = $1 ORDER BY create_at DESC LIMIT 1', [name]);
  return rows[0] ? Number(rows[0].total_token_amount) : 0;
}

async function getTotalTokenBurned(name) {
  const { rows } = await pgPool.query('SELECT total_token_amount FROM burned_tokens WHERE token_name = $1 ORDER BY create_at DESC LIMIT 1', [name]);
  return rows[0] ? Number(rows[0].total_token_amount) : 0;
}

module.exports = {
  saveBlock,
  getLastSavedBlock,
  saveBurnEvent,
  saveMintEvent,
  getTotalTokenMinted,
  getTotalTokenBurned
};
