'use strict';

const { logger } = require('../../common');
const { getTransactions } = require('./repository');

async function getTrans(page, limit) {
  return getTransactions(page, limit);
}

module.exports = {
  getTrans,
};
