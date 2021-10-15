'use strict';

const { logger } = require('../../common');
const { findAllTokens } = require('./repository');

const registeredTokens = new Map();

async function getRegisteredTokens() {
  if (0 === registeredTokens.size) {
    const tokens = await findAllTokens();

    for (const token of tokens)
      registeredTokens.set(`${token.network_id}_${token.token_id}`, token);
  }

  return registeredTokens;
}

function getTokenName(networkId, tokenId) {
  const token = registeredTokens.get(`${networkId}_${tokenId}`);
  return token ? token.token_name : '';
}

module.exports = {
  getRegisteredTokens,
  getTokenName
};
