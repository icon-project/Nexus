'use strict';

const debug = require('debug')('icon');
const { createLogger } = require('../../common');
const IconService = require('icon-sdk-js').default;
const { IconBuilder, HttpProvider } = IconService;
const { saveTokenInfo } = require('./repository');

const httpProvider = new HttpProvider(process.env.ICON_API_URL);
const iconService = new IconService(httpProvider);
const logger = createLogger();

async function handleTokenRegister(txResult, transaction) {
  if (1 !== txResult.status)
    return false;

  // Native coins (IRC31)
  if (process.env.ICON_NATIVE_COIN_BSH_ADDRESS === transaction.to) {
    if ('register' === transaction.data.method) {
      debug('Found coin register on %s', transaction.txHash);

      // Ref: https://github.com/icon-project/btp-dashboard/issues/428
      // Issue: ID is 64 character hex value, 0s are omitted so need to check and pad them back.
      // e.g. 0x8f7ce30203eb1ff1d26492c94d9ab04d63f4e54f1f9e677e8d4a0d6daaab2dd is incorrect
      //      0x08f7ce30203eb1ff1d26492c94d9ab04d63f4e54f1f9e677e8d4a0d6daaab2dd is correct.
      // Changed coinId: https://github.com/icon-project/btp-dashboard/issues/428#issuecomment-958635165
      const id = await getTokenId(transaction.data.params._name);

      const tokenObj = {
        tokenId: id,
        tokenName: transaction.data.params._name,
        txHash: transaction.txHash,
        contractAddress: transaction.to,
        tokenAddress: transaction.to
      };

      if (await saveTokenInfo(tokenObj))
        logger.info(`icon:handleTokenRegister saved coin ${tokenObj.tokenName} on tx ${tokenObj.txHash}`);
    }
  } else {
    // IRC2 tokens
    if ('register' === transaction.data.method) {
      debug('Found token register on %s', transaction.txHash);
      await registerIRC2Token(transaction);
    }
  }
}

// TODO: handle BMS's addService to only check against added BSH transactions.
async function registerIRC2Token(transaction) {
  try {
    const token = {
      tokenId: transaction.data.params.symbol,
      tokenName: transaction.data.params.name,
      txHash: transaction.txHash,
      contractAddress: transaction.to,
      tokenAddress: transaction.data.params.address
    };

    if (await saveTokenInfo(token))
      logger.info(`icon:registerIRC2Token saved token ${token.tokenName} on tx ${token.txHash}`);
  } catch (error) {
    logger.error('icon:registerIRC2Token fails on tx %s %O', transaction.txHash, error);
  }
}

async function getTokenId(name) {
  const callBuilder = new IconBuilder.CallBuilder();

  const txObject = callBuilder
    .to(process.env.ICON_NATIVE_COIN_BSH_ADDRESS)
    .method('coinId')
    .params({ _coinName: name })
    .build();

  const tokenId = await iconService.call(txObject).execute();
  return tokenId;
}

module.exports = {
  handleTokenRegister
};
