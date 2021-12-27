'use strict';

const debug = require('debug')('icon');
const { IconConverter } = require('icon-sdk-js').default;
const { decode } = require('rlp');
const { createLogger, ICX_LOOP_UNIT } = require('../../common');
const { getTokenName } = require('../tokens/model');
const { getTotalTokenAmount, saveToken } = require('./repository');

const ZERO_ADDRESS = 'hx0000000000000000000000000000000000000000';
const TRANSFER_BATCH_PROTOTYPE = 'TransferBatch(Address,Address,Address,bytes,bytes)';
const MINT = 'mint';
const BURN = 'burn';

const logger = createLogger();

async function getTokenInfo(encodedId, encodedValue) {
  const decodedId = decode(encodedId);
  const id = '0x' + decodedId[0].toString('hex');
  const decodedValue = decode(encodedValue);
  const value = IconConverter.toNumber('0x' + decodedValue[0].toString('hex'));

  return {
    tokenId: id,
    tokenValue: value,
    tokenName: getTokenName(process.env.ICON_NETWORK_ID, id)
  };
}

async function getMintBurnEvent(txResult, transaction) {
  try {
    for (let event of txResult.eventLogs) {
      if (TRANSFER_BATCH_PROTOTYPE === event.indexed[0]) {
        const token = await getTokenInfo(event.data[0], event.data[1]);

        return {
          tokenName: token.tokenName,
          tokenId: token.tokenId,
          tokenValue: Number(token.tokenValue) / ICX_LOOP_UNIT,
          to: event.indexed[3],
          from: event.indexed[2],
          txHash: txResult.txHash,
          blockTime: Math.floor(transaction.timestamp / 1000),
          networkId: process.env.ICON_NETWORK_ID
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
  if (process.env.ICON_BMC_ADDRESS !== transaction.to || 1 !== txResult.status || 0 === txResult.eventLogs.length
    || TRANSFER_BATCH_PROTOTYPE !== txResult.eventLogs[0].indexed[0])
    return false;

  try {
    const eventObj = await getMintBurnEvent(txResult, transaction);

    if (!eventObj || !eventObj.tokenName) {
      logger.warn('icon:handleMintBurnEvents Token not registered %s, tx_hash: %s', eventObj.tokenId, transaction.txHash);
      return false;
    } else {
      logger.info(`icon:handleMintBurnEvents get TransferBatch event in tx ${transaction.txHash}`);
    }

    // mint when _from value is ZERO
    // burn when _to value is ZERO
    if (ZERO_ADDRESS === txResult.eventLogs[0].indexed[2]) {
      logger.info(`icon:Mint ${eventObj.tokenValue} ${eventObj.tokenName} in tx ${transaction.txHash}`);

      const totalMintToken = await getTotalTokenAmount(eventObj.tokenName, MINT);
      await saveToken(eventObj, totalMintToken, MINT);
    } else if (ZERO_ADDRESS === txResult.eventLogs[0].indexed[3]) {
      logger.info(`icon:Burn ${eventObj.tokenValue} ${eventObj.tokenName} in tx ${transaction.txHash}`);

      const totalBurnToken = await getTotalTokenAmount(eventObj.tokenName, BURN);
      await saveToken(eventObj, totalBurnToken, BURN);
    }
  } catch (error) {
    logger.error('icon:handleMintBurnEvents failed %O', error);
  }
}

module.exports = {
  handleMintBurnEvents,
  getMintBurnEvent
};
