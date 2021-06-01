'use strict';

const { pgPool } = require('../../common');

async function countNetWork() {
  const {
    rows: [count],
  } = await pgPool.query('SELECT COUNT(*) FROM "networks"');
  return count.count;
}
module.exports = {
  countNetWork,
};
