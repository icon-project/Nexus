'use strict';
const { createLogger, pgPool } = require('../../common');
const logger = createLogger();

async function getIndexerStatByNetworkId(networkId) {
  const query = 'SELECT * FROM indexer_stats WHERE network_id = $1';
  try {
    const { rows } = await pgPool.query(query, [networkId]);
    if (rows.length > 0) {
      const row = rows[0];
      return {
        networkId: row.network_id,
        name: row.name,
        blockHeight: Number(row.block_height),
        createAt: row.create_at,
        updateAt: row.update_at
      };
    }
    return null;
  } catch (error) {
    logger.error(error);
    return null;
  }
}

module.exports = {
  getIndexerStatByNetworkId
};
