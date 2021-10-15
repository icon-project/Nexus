'use strict';

const debug = require('debug')('db');
const { logger, pgPool } = require('../../common');

async function findAllTokens() {
  try {
    const { rows } = await pgPool.query('SELECT * FROM token_info ORDER BY create_at DESC');
    return rows;
  } catch (error) {
    logger.error('findAllTokens fails: %s, %s', error.message, error.detail);
  }
}

module.exports = {
  findAllTokens
};
