'use strict';

const debug = require('debug')('db');
const { pgPool, logger } = require("../../common");

async function saveBlock(block) {
  try {
    const query = 'INSERT INTO icon_blocks (block_hash, block_height, block_data, created_time) VALUES ($1, $2, $3, NOW())';
    const values = [block.blockHash, block.height, JSON.stringify(block)];

    await pgPool.query(query, values);
  } catch (error) {
    logger.error(`saveBlock fails with block ${block.height}`, { error });
  }
}

async function getLastBlock() {
  try {
    const query = 'SELECT * FROM icon_blocks ORDER BY block_height DESC LIMIT 1';
    const { rows } = await pgPool.query(query);

    if (rows[0]) {
      return JSON.parse(rows[0].block_data);
    }
  } catch (error) {
    logger.error('getLastBlock fails', { error });
  }
}



module.exports = {
  saveBlock,
  getLastBlock
};
