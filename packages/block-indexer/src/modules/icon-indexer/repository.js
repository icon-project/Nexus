'use strict';

const { pgPool, createLogger, logDbError } = require('../../common');
const { v4: uuidv4 } = require('uuid');

const logger = createLogger();
/*
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
*/
async function saveTokenInfo(tokenObj) {
  try {
    const query = 'INSERT INTO registered_tokens (id, network_id, token_id, token_name, tx_hash, create_at, contract_address, token_address) VALUES ($1, $2, $3, $4, $5, NOW(), $6, $7)';
    const values = [uuidv4(), process.env.ICON_NETWORK_ID, tokenObj.tokenId, tokenObj.tokenName, tokenObj.txHash, tokenObj.contractAddress, tokenObj.tokenAddress];

    await pgPool.query(query, values);
    return true;
  } catch (error) {
    logger.error('saveTokenInfo fails: %s, %s', error.message, error.detail);
  }
}

async function registerRelayer(relayer) {
  try {
    const query = 'INSERT INTO relay_candidates (tx_hash, name, address, bonded_icx, registered_time) VALUES ($1, $2, $3, $4, $5)';
    const values = [relayer.txHash, relayer.name, relayer.address, relayer.bondedIcx, relayer.registeredTime];
    await pgPool.query(query, values);
  } catch (error) {
    logger.error('registerRelayer fails: %s, %s', error.message, error.detail);
  }
}

async function unregisterRelayer(relayer) {
  try {
    const query = 'UPDATE relay_candidates SET unregistered_time=$1, tx_hash_unregistered=$2, updated_time=NOW() WHERE address=$3';
    await pgPool.query(query, [relayer.unregisteredTime, relayer.txHash, relayer.address]);
  } catch (error) {
    logger.error('unregisterRelayer fails: %s, %s', error.message, error.detail);
  }
}

module.exports = {
  saveTokenInfo,
  registerRelayer,
  unregisterRelayer
};
