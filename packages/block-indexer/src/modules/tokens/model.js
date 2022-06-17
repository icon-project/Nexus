/* eslint-disable curly */
/* eslint-disable yoda */
'use strict';

const debug = require('debug')('icon');
const { findAllTokens } = require('./repository');
const registeredTokens = new Map();

// Map<contract address, token>
async function getRegisteredTokens() {
  if (0 === registeredTokens.size) {
    const tokens = await findAllTokens();
    for (const token of tokens) {
      registeredTokens.set(token.contract_address.toLowerCase(), token);
    }
  }

  return registeredTokens;
}

async function refreshRegisteredTokens() {
  registeredTokens.clear();

  const tokens = await getRegisteredTokens();
  debug('Refreshed registered tokens: %O', tokens);

  return tokens;
}

function getTokenName(contractAddress) {
  const token = registeredTokens.get(contractAddress);
  return token ? token.token_id : '';
}

module.exports = {
  getRegisteredTokens,
  refreshRegisteredTokens,
  getTokenName
};
