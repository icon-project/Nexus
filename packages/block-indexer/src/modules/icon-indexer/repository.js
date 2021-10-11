'use strict';

const { pgPool, logger, logDbError } = require('../../common');
const { v4: uuidv4 } = require('uuid');

async function saveBlock(block) {
  try {
    const query = 'INSERT INTO icon_blocks (block_hash, block_height, block_data, created_time) VALUES ($1, $2, $3, NOW())';
    const values = [block.blockHash, block.height, JSON.stringify(block)];

    await pgPool.query(query, values);
  } catch (error) {
    logger.error(`saveBlock fails with block ${block.height}`, { error });
  }
}

async function getLastSavedBlock() {
  try {
    const query = 'SELECT * FROM icon_blocks ORDER BY block_height DESC LIMIT 1';
    const { rows } = await pgPool.query(query);

    if (rows[0]) {
      return JSON.parse(rows[0].block_data);
    }
  } catch (error) {
    logger.error('getLastSavedBlock fails', { error });
  }
}

async function saveTokenInfo(tokenObj) {
  try {
    const query = 'INSERT INTO token_info (id, network_id, token_id, token_name, tx_hash, create_at, contract_address, token_address) VALUES ($1, $2, $3, $4, $5, NOW(), $6, $7)';
    const values = [uuidv4(), process.env.ICON_NETWORK_ID, tokenObj.tokenId, tokenObj.tokenName, tokenObj.txHash, tokenObj.contractAddress, tokenObj.tokenAddress];

    await pgPool.query(query, values);
    return true;
  } catch (error) {
    logger.error('saveTokenInfo fails: %s, %s', error.message, error.detail);
  }
}

module.exports = {
  saveBlock,
  getLastSavedBlock,
  saveTokenInfo
};
