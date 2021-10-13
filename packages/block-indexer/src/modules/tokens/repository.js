'use strict';

const { logger, pgPool } = require('../../common');

async function getTokenNameById(tokenId) {
  // const { rows } = await pgPool.query('SELECT total_token_amount FROM minted_tokens WHERE token_name = $1 ORDER BY create_at DESC LIMIT 1', [name]);
  // return rows[0] ? Number(rows[0].total_token_amount) : 0;
}

module.exports = {
  getTokenNameById
};
