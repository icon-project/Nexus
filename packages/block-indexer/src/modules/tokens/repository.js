'use strict';

const { createLogger, pgPool } = require('../../common');

const logger = createLogger();

async function findAllTokens() {
  try {
    const { rows } = await pgPool.query('SELECT * FROM registered_tokens WHERE active=1 ORDER BY create_at DESC');
    return rows;
  } catch (error) {
    logger.error('findAllTokens fails: %s, %s', error.message, error.detail);
  }
}

async function saveToken(token) {
  try {
    const query = 'INSERT INTO registered_tokens (network_id, token_id, token_name, tx_hash, contract_address) VALUES ($1, $2, $3, $4, $5)';
    const values = [token.networkId, token.tokenId, token.tokenName, token.txHash, token.contractAddress];

    await pgPool.query(query, values);
    return true;
  } catch (error) {
    logger.error('saveToken fails: %s, %s', error.message, error.detail);
  }
}

module.exports = {
  findAllTokens,
  saveToken
};
