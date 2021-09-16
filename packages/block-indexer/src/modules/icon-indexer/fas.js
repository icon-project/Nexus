'use strict';

const debug = require('debug')('icon');
const { IconBuilder } = require('icon-sdk-js');

/* Example token map for testing.
const registeredTokens = new Map([
  ['cx5574137f1a9544c2cd2ab14bf8d5a285c43f761e', {
    tokenId: 0,
    address: 'cx5574137f1a9544c2cd2ab14bf8d5a285c43f761e',
    name: 'SampleToken1406'
  }]
]);*/

const registeredTokens = new Map();

async function loadRegisteredTokens(iconService) {
  const callBuilder = new IconBuilder.CallBuilder();
  const txObject = callBuilder
    .to(process.env.ICON_FAS_ADDRESS)
    .method('tokens')
    .build();

  const tokens = await iconService.call(txObject).execute();
  debug('Registered tokens: ', tokens);

  for (const token of tokens)
    registeredTokens.set(token.address, token);

  return tokens;
}

function getRegisteredTokens() {
  return registeredTokens;
}

module.exports = {
  loadRegisteredTokens,
  getRegisteredTokens
};
