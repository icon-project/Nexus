/* eslint-disable yoda */
'use strict';

const IconService = require('icon-sdk-js').default;
const { createLogger } = require('../../common');
const { saveToken } = require('./repository');
const { refreshRegisteredTokens } = require('./model');
const { getBSHAddressesMap } = require('../common/addresses');

const httpProvider = new IconService.HttpProvider(process.env.ICON_API_URL);
const iconService = new IconService(httpProvider);
const logger = createLogger();

// Ref: https://github.com/icon-project/btp/blob/icondao/javascore/nativecoin/src/main/java/foundation/icon/btp/nativecoin/NativeCoinService.java#L103
async function handleTokenRegister(transaction) {
  const bshAddresses = getBSHAddressesMap();
  // TODO: should remove this line after ICON BMC is merged.
  if (bshAddresses.has(transaction.to) && 'register' === transaction.data.method) {
    logger.info('Found token register on %s', transaction.txHash);
    await registerIRC2Token(transaction);
  }
}

async function registerIRC2Token(transaction) {
  try {
    const address = await getTokenContractAddress(transaction.data.params._name);

    const token = {
      networkId: process.env.ICON_NETWORK_ID,
      tokenName: transaction.data.params._name,
      tokenId: transaction.data.params._symbol,
      contractAddress: address,
      txHash: transaction.txHash
    };

    if (await saveToken(token)) {
      logger.info(`registerIRC2Token saved new token ${token.tokenName} on tx ${token.txHash}`);
      await refreshRegisteredTokens();
    }
  } catch (error) {
    logger.error('registerIRC2Token fails on tx %s with %O', transaction.txHash, error);
  }
}

async function getTokenContractAddress(name) {
  const callBuilder = new IconService.IconBuilder.CallBuilder();

  const txObject = callBuilder
    .to(process.env.ICON_NATIVE_COIN_BSH_ADDRESS)
    .method('coinAddress')
    .params({ _coinName: name })
    .build();

  return await iconService.call(txObject).execute();
}

module.exports = {
  handleTokenRegister
};
