/* eslint-disable yoda */
'use strict';

const { createLogger, TOKEN_REGISTERED_EVENT_UPPER } = require('../../common');
const { saveToken } = require('./repository');
const { refreshRegisteredTokens } = require('./model');
const { isJSON } = require('../../common/util');

const logger = createLogger();

async function handleTokenRegister(tx, txResult) {
  for (const receiptOutcome of txResult?.receipts_outcome) {
    for (const log of receiptOutcome?.outcome?.logs) {
      if (log.includes(TOKEN_REGISTERED_EVENT_UPPER) && isJSON(log)) {
        const data = JSON.parse(log);
        await registerNEP21Token(data, tx.hash);
      }
    }
  }
}
// Defination for ERC20 is NEP-21 on NEAR https://github.com/near/NEPs/pull/21
async function registerNEP21Token(data, txHash) {
  try {
    const tokenName = data.token_name?.split('-')?.[2];
    const token = {
      networkId: process.env.NEAR_NETWORK_ID,
      tokenName: tokenName,
      tokenId: tokenName,
      contractAddress: data.token_account,
      txHash
    };

    if (await saveToken(token)) {
      logger.info(`registerNEP21Token saved new token ${token.tokenName} on tx ${token.txHash}`);
      await refreshRegisteredTokens();
    }
  } catch (error) {
    logger.error('registerNEP21Token fails on tx %s with %O', txHash, error);
  }
}

module.exports = {
  handleTokenRegister
};
