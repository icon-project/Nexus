'use strict';

const { findAllTokens } = require('./repository');
const registeredTokens = new Map();

async function getRegisteredTokens() {
  if (0 === registeredTokens.size) {
    const tokens = await findAllTokens();

    for (const token of tokens)
      registeredTokens.set(token.contract_address, token);
  }

  return registeredTokens;
}

function getTokenName(contractAddress) {
  const token = registeredTokens.get(contractAddress);
  return token ? token.token_name : '';
}

module.exports = {
  getRegisteredTokens,
  getTokenName
};
