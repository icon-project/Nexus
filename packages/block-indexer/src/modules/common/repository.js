'use strict';

const { pgPool, createLogger } = require('../../common');
const logger = createLogger();

async function saveIndexedBlockHeight(blockHeight, networkId) {
  try {
    const query = 'UPDATE indexer_stats SET block_height=$1, update_at=NOW() WHERE network_id=$2';
    await pgPool.query(query, [blockHeight, networkId]);

    return true;
  } catch (error) {
    logger.error(`saveIndexedBlockHeight fails with block ${blockHeight}, network ${networkId}: %O`, error);
  }
}

async function getIndexedBlockHeight(networkId) {
  try {
    const query = 'SELECT block_height FROM indexer_stats WHERE network_id=$1';
    const { rows } = await pgPool.query(query, [networkId]);

    return rows[0] ? Number(rows[0].block_height) : 0;
  } catch (error) {
    logger.error(`getIndexedBlockHeight fails on network ${networkId}: %O`, error);
  }
}

module.exports = {
  saveIndexedBlockHeight,
  getIndexedBlockHeight
};
