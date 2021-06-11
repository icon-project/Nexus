'use strict';

const { logger } = require('../../common');
const { countTotalRelay } = require('./repository');

async function getTotalRelay() {
  return await countTotalRelay();
}

module.exports = {
  getTotalRelay
};
