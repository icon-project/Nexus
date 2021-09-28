'use strict';

const debug = require('debug')('icon');
const { logger, pgPool } = require('../../common');
const { v4: uuidv4 } = require('uuid');
const IconService = require('icon-sdk-js');
const { IconBuilder, HttpProvider } = require('icon-sdk-js');

const httpProvider = new HttpProvider(process.env.ICON_API_URL);
const iconService = new IconService(httpProvider);

async function handleTokenRegister(txResult, transaction) {
  // Handle native coin.
  if (1 === txResult.status && process.env.ICON_NATIVE_COIN_BSH_ADDRESS === transaction.to) {
    if ('register' === transaction.data.method) {
      const id = await getTokenId(transaction.data.params._name);

      const tokenObj = {
        tokenId: id,
        tokenName: transaction.data.params._name,
        txHash: transaction.txHash,
        contractAddress: transaction.to
      };

      await saveTokenInfo(tokenObj);
    }
  }
}

async function saveTokenInfo(tokenObj) {
  try {
    const query = 'INSERT INTO token_info (id, network_id, token_id, token_name, tx_hash, create_at, contract_address, token_address) VALUES ($1, $2, $3, $4, $5, NOW(), $6, $7)';
    const values = [uuidv4(), process.env.ICON_NETWORK_ID, tokenObj.tokenId, tokenObj.tokenName, tokenObj.txHash, tokenObj.contractAddress, tokenObj.contractAddress];

    await pgPool.query(query, values);
  } catch (error) {
    logger.error('saveTokenInfo failed %O', error);
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
