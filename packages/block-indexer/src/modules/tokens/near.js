/* eslint-disable yoda */
'use strict';

const { createLogger, TOKEN_REGISTERED_EVENT } = require('../../common');
const { saveToken } = require('./repository');
const { refreshRegisteredTokens } = require('./model');
const { isJSON } = require('../../common/util');

const logger = createLogger();

async function handleTokenRegister(tx, txResult) {
  for (const receiptOutcome of txResult?.receipts_outcome) {
    for (const log of receiptOutcome?.outcome?.logs) {
      if (log.includes(TOKEN_REGISTERED_EVENT) && isJSON(log)) {
        const data = JSON.parse(log);
        await registerIRC2Token(data, tx.hash);
      }
    }
  }
}

async function registerIRC2Token(data, txHash) {
  try {
    const address = await getTokenContractAddress(data.tokenName);

    const token = {
      networkId: process.env.NEAR_NETWORK_ID,
      tokenName: data.tokenName,
      tokenId: data.tokenId,
      contractAddress: address,
      txHash
    };

    if (await saveToken(token)) {
      logger.info(`registerIRC2Token saved new token ${token.tokenName} on tx ${token.txHash}`);
      await refreshRegisteredTokens();
    }
  } catch (error) {
    logger.error('registerIRC2Token fails on tx %s with %O', txHash, error);
  }
}

async function getTokenContractAddress(name) {
  // TODO
  return 'address of token';
}

module.exports = {
  handleTokenRegister
};
