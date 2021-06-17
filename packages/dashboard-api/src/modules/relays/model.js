'use strict';

const { logger } = require('../../common');
const { countTotalRelay, getRelayDetailList } = require('./repository');

async function getTotalRelay() {
  return await countTotalRelay();
}

async function getRelayList() {
  return await getRelayDetailList();
}

module.exports = {
  getTotalRelay,
  getRelayList
};
