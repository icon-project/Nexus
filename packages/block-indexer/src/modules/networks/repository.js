'use strict';
const { logger, pgPool } = require('../../common');

async function getNetworkById(id) {
  try {
    const { rows } = await pgPool.query('SELECT name FROM networks WHERE id = $1', [id]);
    let name = '';
    if (rows.length > 0) {
      name = rows[0].name;
    }
    return { name };
  } catch (error) {
    logger.error(error);
    return { name: '' };
  }
}

module.exports = {
  getNetworkById
};
