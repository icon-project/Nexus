'use strict';

const { logger } = require('../../common');
const { findAllTokens } = require('./repository');

const registeredTokens = new Map();

async function getRegisteredTokens() {
  if (0 === registeredTokens.size) {
    const tokens = await findAllTokens();

    for (const token of tokens)
      registeredTokens.set(token.token_id, token);
  }

  return registeredTokens;
}

async function getTokenName(tokenId) {
  const token = registeredTokens.get(tokenId);
  return token ? token.token_name : '';
}

module.exports = {
  getRegisteredTokens,
  getTokenName
};
