'use strict';

const { logger } = require('../../common');
const { getTransactions } = require('./repository');

async function getTrans(page, limit, from, to) {
  return getTransactions(page, limit, from, to);
}

module.exports = {
  getTrans,
};
