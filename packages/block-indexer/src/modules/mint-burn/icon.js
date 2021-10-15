'use strict';

const debug = require('debug')('icon');
const { IconConverter } = require('icon-sdk-js');
const { decode } = require('rlp');
const { logger, ICX_LOOP_UNIT } = require('../../common');
const { getTokenName } = require('../tokens/model');
const { getTotalTokenAmount, saveToken } = require('./repository');

const ZERO_ADDRESS = 'hx0000000000000000000000000000000000000000';
const TRANSFER_BATCH_PROTOTYPE = 'TransferBatch(Address,Address,Address,bytes,bytes)';
const MINT = 'mint';
const BURN = 'burn';

async function getTokensInfo(idEncode, valueEncode) {
  const valueDecoded = decode(valueEncode);
  const idDecoded = decode(idEncode);
  const id = '0x' + idDecoded[0].toString('hex').substring(1);
  const name = getTokenName(process.env.ICON_NETWORK_ID, id);
  const value = IconConverter.toNumber('0x' + valueDecoded[0].toString('hex'));

  return {
    tokenValue: value,
    tokenName: name,
    tokenId: id,
  };
}

async function getMintBurnEvent(txResult, transaction) {
  try {
    for (let event of txResult.eventLogs) {
      if (TRANSFER_BATCH_PROTOTYPE === event.indexed[0]) {
        const token = await getTokensInfo(event.data[0], event.data[1]);

        return {
          tokenName: token.tokenName,
          tokenId: token.tokenId,
          tokenValue: Number(token.tokenValue) / ICX_LOOP_UNIT,
          to: event.indexed[3],
          from: event.indexed[2],
          txHash: txResult.txHash,
          blockHash: txResult.blockHash,
          blockHeight: txResult.blockHeight,
          blockTime: Math.floor(transaction.timestamp / 1000),
          networkId: process.env.ICON_NETWORK_ID,
        };
      }
    }
  } catch (error) {
    logger.error('icon:getMintBurnEvent incorrect eventLogs %O', error);
  }
}

// Mint: Alice on ICON got a DEV from Moonbeam (a DEV minted to Alice).
// Burn: Alice on ICON send a DEV (which she got from Bob earlier) to Bob on Moonbeam (a DEV burned from Alice).
async function handleMintBurnEvents(txResult, transaction) {
  if (
    0 === txResult.eventLogs.length ||
    1 !== txResult.status ||
    TRANSFER_BATCH_PROTOTYPE !== txResult.eventLogs[0].indexed[0]
  )
    return false;

  try {
    const eventObj = await getMintBurnEvent(txResult, transaction);

    if (!eventObj || !eventObj.tokenName) {
      logger.warn(
        'icon:handleMintBurnEvents Token not registered, tx_hash: %s',
        transaction.txHash,
      );
      return false;
    } else {
      logger.info(`icon:handleMintBurnEvents get TransferBatch event in tx ${transaction.txHash}`);
    }

    // mint when _from value is ZERO
    // burn when _to value is ZERO
    if (ZERO_ADDRESS === txResult.eventLogs[0].indexed[2]) {
      const totalMintToken = await getTotalTokenAmount(eventObj.tokenName, MINT);
      await saveToken(eventObj, totalMintToken, MINT);
    } else if (ZERO_ADDRESS === txResult.eventLogs[0].indexed[3]) {
      const totalBurnToken = await getTotalTokenAmount(eventObj.tokenName, BURN);
      await saveToken(eventObj, totalBurnToken, BURN);
    }
  } catch (error) {
    logger.error('icon:handleMintBurnEvents failed %O', error);
  }
}

module.exports = {
  handleMintBurnEvents,
};
