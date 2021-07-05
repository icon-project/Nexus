'use strict';

const { getTransactions, getTransactionById } = require('./repository');

async function getTrans(page, limit, from, to) {
  return getTransactions(page, limit, from, to);
}


async function getTransById(id) {
  return getTransactionById(id);
}
module.exports = {
  getTrans,
  getTransById,
};
