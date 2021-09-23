'use strict';

const debug = require('debug')('icon');
const { logger, pgPool } = require('../../common');
const { v4: uuidv4 } = require('uuid');
const IconService = require('icon-sdk-js');
const { IconBuilder, HttpProvider } = require('icon-sdk-js');

const httpProvider = new HttpProvider(process.env.ICON_API_URL);
const iconService = new IconService(httpProvider);

async function handleTokenRegister(txResult, transaction) {
  if (transaction.data.method) {
    if('register' === transaction.data.method && 1 === txResult.status) {
      const id = await getTokenId(transaction.data.params._name);

      const tokenObj = {
        tokenId: id,
        tokenName: transaction.data.params._name
      };

      await saveTokenInfo(tokenObj, txResult);
    }
  }
}

async function saveTokenInfo(tokenObj, txResult) {
  try {
    preSave(tokenObj);

    const query = 'INSERT INTO token_info (id, network_id, token_id, token_name, tx_hash, create_at) VALUES ($1, $2, $3, $4, $5, NOW())';
    const values = [tokenObj.id, process.env.ICON_NETWORK_ID, tokenObj.tokenId, tokenObj.tokenName, txResult.txHash];

    await pgPool.query(query, values);
  } catch (error) {
    logger.error('saveTokenInfo failed ', { error });
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
  debug('Token Name %O Token ID: %O', name, tokenId);

  return tokenId;
}

function preSave(data) {
  if (!data.id) {
    data.id = uuidv4();
    data.createAt = Math.floor(new Date().getTime());
  }
}

module.exports = {
  handleTokenRegister
};
