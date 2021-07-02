'use strict';

const { logger, pgPool } = require('../../common');

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

async function saveTransaction(transaction) {
}

module.exports = {
  saveBlock,
  saveTransaction,
  getLastSavedBlock
};
