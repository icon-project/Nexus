/* eslint-disable no-useless-escape */
'use strict';

const {
  getNetworkById
} = require('./repository');

const getNetworkByToAddress = async (address) => {
  const pattern = /^btp:\/\/.+\./i;
  const match = address.match(pattern);
  let networkID = null;
  if (match) {
    networkID = match[0].slice(6, -1);
  }

  return await getNetworkById(networkID);
};

module.exports = {
  getNetworkById,
  getNetworkByToAddress
};
