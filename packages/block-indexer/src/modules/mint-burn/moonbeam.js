'use strict';

// OBSOLETE, Moonbeam is using web3.js

const Web3 = require('web3');
const { createLogger, ICX_LOOP_UNIT, CONTRACT_ZERO_ADDRESS, MINT_EVENT, BURN_EVENT } = require('../../common');
const { findEventByName, decodeEventLog, getMoonbeamEventMap } = require('../common/events');
const { getTokenContractMap } = require('../transactions/model');
const { getTokenName } = require('../tokens/model');
const { saveToken, getTotalTokenAmount } = require('./repository');

const web3 = new Web3(process.env.MOONBEAM_API_URL);
const bmcAddress = process.env.MOONBEAM_BMC_ADDRESS.toLowerCase();
const logger = createLogger();

// eslint-disable-next-line no-unused-vars
async function handleMintBurnEvents(tx, receipt, block) {
  const eventMap = getMoonbeamEventMap();
  const contractMap = await getTokenContractMap();
  const txTo = tx.to.toLowerCase();

  // Mint in a tx send to BSH but burn in a tx send to BMC.
  // Ref: https://github.com/icon-project/btp-dashboard/issues/465#issuecomment-966937077
  if (contractMap.has(txTo) || bmcAddress === txTo) {
    const transferSingle = findEventByName('TransferSingle', eventMap, receipt.logs);

    if (transferSingle) {
      logger.info(`moonbeam:handleMintBurnEvents get TransferSingle event in tx ${tx.hash}`);

      const eventData = decodeEventLog(web3, eventMap, 'TransferSingle', transferSingle);
      await handleTransferSingleEvent(eventData, tx, block);
    }
  }
}

/*
Decoded TransferSingle event.

Result {
  '0': '0x7d4567B7257cf869B01a47E8cf0EDB3814bDb963',
  '1': '0x9FE123AC9FC29B832c2a16DD83bcE9b509B4C22D',
  '2': '0x7d4567B7257cf869B01a47E8cf0EDB3814bDb963',
  '3': '74645123150620096120801602238006067452189572593452417212166420008730219938226',
  '4': '100000000000000000',
  __length__: 5,
  operator: '0x7d4567B7257cf869B01a47E8cf0EDB3814bDb963',
  from: '0x9FE123AC9FC29B832c2a16DD83bcE9b509B4C22D',
  to: '0x7d4567B7257cf869B01a47E8cf0EDB3814bDb963',
  id: '74645123150620096120801602238006067452189572593452417212166420008730219938226',
  value: '100000000000000000'
}
*/
async function handleTransferSingleEvent(eventData, tx, block) {
  try {
    const tokenId = '0x' + eventData.id;
    const tokenName = getTokenName(process.env.MOONBEAM_NETWORK_ID, tokenId);

    if (!tokenName) {
      logger.warn('moonbeam:handleTransferSingleEvent found an unregistered token ID=%s', eventData.id);
      return false;
    }

    const mintBurn = {
      tokenId,
      tokenName,
      tokenValue: Number(eventData.value) / ICX_LOOP_UNIT,
      to: eventData.to.toLowerCase(),
      from: eventData.from.toLowerCase(),
      txHash: tx.hash,
      networkId: process.env.MOONBEAM_NETWORK_ID,
      blockTime: web3.utils.hexToNumber(block.timestamp) * 1000
    };

    if (CONTRACT_ZERO_ADDRESS === mintBurn.from) {
      const totalToken = await getTotalTokenAmount(mintBurn.tokenName, MINT_EVENT);
      await saveToken(mintBurn, totalToken, MINT_EVENT);
    } else {
      const totalToken = await getTotalTokenAmount(mintBurn.tokenName, BURN_EVENT);
      await saveToken(mintBurn, totalToken, BURN_EVENT);
    }
  } catch (error) {
    logger.error('moonbeam:handleTransferSingleEvent fails %O', error);
  }
}

module.exports = {
  // handleMintBurnEvents
};
