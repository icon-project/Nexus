'use strict';

const { countTotalRelay, getRelayDetailList, getById } = require('./repository');

async function getTotalRelay() {
  return await countTotalRelay();
}

async function getRelayList() {
  return await getRelayDetailList();
}

async function getRelayById(id) {
  return getById(id);
}
module.exports = {
  getTotalRelay,
  getRelayList,
  getRelayById,
};
