'use strict';

const debug = require('debug')('icon');
const { IconConverter } = require('icon-sdk-js').default;
const { createLogger, ICX_LOOP_UNIT, MINT_EVENT, BURN_EVENT, ICON_ZERO_ADDRESS } = require('../../common');
const { getTokenName } = require('../tokens/model');
const { getTotalTokenAmount, saveToken } = require('./repository');

const logger = createLogger();

// void Transfer(Address _from, Address _to, BigInteger _value, byte[] _data);
// Ref: https://github.com/icon-project/btp/blob/icondao/javascore/nativecoinIRC2/src/main/java/foundation/icon/btp/nativecoinIRC2/irc2/IRC2.java#L48
const TRANSFER_PROTOTYPE = 'Transfer(Address,Address,int,bytes)';

// Changes to IRC2/ERC20: native BSH has 1 native coin and 1 wrapped coin (native coin from another network).
// Mint/burn only happens to a wrapped coin.
async function getMintBurnEvent(event, transaction) {
  try {
    return {
      tokenName: getTokenName(event.scoreAddress), // <= must be always DEV
      tokenValue: Number(IconConverter.toNumber(event.indexed[3])) / ICX_LOOP_UNIT,
      from: event.indexed[1],
      to: event.indexed[2],
      networkId: process.env.ICON_NETWORK_ID,
      txHash: transaction.txHash,
      blockTime: Math.floor(transaction.timestamp / 1000)
    };
  } catch (error) {
    logger.error('icon:getMintBurnEvent incorrect eventLogs %O', error);
  }
}

// Mint: Alice on ICON got a DEV from Moonbeam (a DEV minted to Alice).
// Burn: Alice on ICON send a DEV (which she got from Bob earlier) to Bob on Moonbeam (a DEV burned from Alice).
async function handleMintBurnEvents(txResult, transaction) {
  if (process.env.ICON_BMC_ADDRESS !== transaction.to || 1 !== txResult.status || 0 === txResult.eventLogs.length
    || TRANSFER_PROTOTYPE !== txResult.eventLogs[0].indexed[0])
    return false;

  try {
    const eventObj = await getMintBurnEvent(txResult.eventLogs[0], transaction);

    if (process.env.ICON_NATIVE_COIN_BSH_ADDRESS !== eventObj.from)
      return false;

    if (eventObj && eventObj.tokenName) {
      logger.info(`icon:handleMintBurnEvents get Transfer event of ${eventObj.tokenName} in tx ${transaction.txHash}`);
    } else {
      logger.warn(`icon:handleMintBurnEvents token not registered ${txResult.eventLogs[0].scoreAddress} in tx ${transaction.txHash}`);
      return false;
    }

    // Mint/burn with right IRC2 specs: disabled now.
    // Mint: _from = ICON_ZERO_ADDRESS
    // https://github.com/icon-project/btp/blob/icondao/javascore/nativecoinIRC2/src/main/java/foundation/icon/btp/nativecoinIRC2/irc2/IRC2Basic.java#L96
    // Burn: _to = ICON_ZERO_ADDRESS
    // https://github.com/icon-project/btp/blob/icondao/javascore/nativecoinIRC2/src/main/java/foundation/icon/btp/nativecoinIRC2/irc2/IRC2Basic.java#L109
    // _data is "mint" and "burn" respectively but not needed here.

    // Mint/burn with right Simson's IRC2 specs: current, https://docs.opendevicon.io/score-library/irc2standard/irc2
    // BMC emits Transfer event with _from always is BSH
    // _to is an user for mint https://berlin.tracker.solidwallet.io/transaction/0x163a8b4ff3122c22bd393f77053592c7d8ad7b3b3f31c50df824d5fffbac8bc0#events
    // _to is ZERO for burn https://berlin.tracker.solidwallet.io/transaction/0x416579c00572910d96f7be9b9adef768bd0c0cf3ac25413718b7c2908a9d5799#events
    if (ICON_ZERO_ADDRESS === eventObj.to) {
      logger.info(`Burn ${eventObj.tokenValue} ${eventObj.tokenName} in tx ${transaction.txHash}`);

      const totalBurnToken = await getTotalTokenAmount(eventObj.tokenName, BURN_EVENT);
      await saveToken(eventObj, totalBurnToken, BURN_EVENT);
    } else {
      logger.info(`Mint ${eventObj.tokenValue} ${eventObj.tokenName} in tx ${transaction.txHash}`);

      const totalMintToken = await getTotalTokenAmount(eventObj.tokenName, MINT_EVENT);
      await saveToken(eventObj, totalMintToken, MINT_EVENT);
    }
  } catch (error) {
    logger.error('icon:handleMintBurnEvents failed %O', error);
  }
}

module.exports = {
  handleMintBurnEvents,
  getMintBurnEvent
};
