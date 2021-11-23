'use strict';

const Web3 = require('web3');
const debug = require('debug')('bsc_tx');
const { logger, ICX_LOOP_UNIT, CONTRACT_ZERO_ADDRESS, MINT_EVENT, BURN_EVENT } = require('../../common');
const { findEventByName, decodeEventLog, getMoonbeamEventMap } = require('../common/events');
const { getTokenContractMap } = require('../transactions/model');
const { getTokenName } = require('../tokens/model');
const { saveToken, getTotalTokenAmount } = require('./repository');

const web3 = new Web3(process.env.MOONBEAM_API_URL);
const bmcAddress = process.env.BSC_BMC_ADDRESS.toLowerCase();
const TRANSFER_SINGLE_EVENT = 'TransferSingle';

async function handleMintBurnEvents(tx, receipt, block) {
  const eventMap = getMoonbeamEventMap();
  const contractMap = await getTokenContractMap();
  const txTo = tx.to.toLowerCase();

  // Mint in a tx send to BSH but burn in a tx send to BMC.
  // Ref: https://github.com/icon-project/btp-dashboard/issues/465#issuecomment-966937077
  if (contractMap.has(txTo) || bmcAddress === txTo) {
    const transferSingle = findEventByName(TRANSFER_SINGLE_EVENT, eventMap, receipt.logs);
    debug('TransferSingle %O', transferSingle);

    if (transferSingle) {
      logger.info(`bsc:handleMintBurnEvents get ${TRANSFER_SINGLE_EVENT} event in tx ${tx.hash}`);

      const eventData = decodeEventLog(web3, eventMap, TRANSFER_SINGLE_EVENT, transferSingle);
      debug('TransferSingle decoded %O', eventData);
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
    const tokenName = getTokenName(process.env.BSC_NETWORK_ID, tokenId);

    if (!tokenName) {
      logger.warn('bsc:handleTransferSingleEvent found an unregistered token ID=%s', eventData.id);
      return false;
    }

    const mintBurn = {
      tokenId,
      tokenName,
      tokenValue: Number(eventData.value) / ICX_LOOP_UNIT,
      to: eventData.to.toLowerCase(),
      from: eventData.from.toLowerCase(),
      txHash: tx.hash,
      networkId: process.env.BSC_NETWORK_ID,
      blockTime: web3.utils.hexToNumber(block.timestamp) * 1000
    };

    if (CONTRACT_ZERO_ADDRESS === mintBurn.from) {
      logger.info(`bsc:Mint ${mintBurn.tokenValue} ${mintBurn.tokenName} in tx ${tx.hash}`);

      const totalToken = await getTotalTokenAmount(mintBurn.tokenName, MINT_EVENT);
      await saveToken(mintBurn, totalToken, MINT_EVENT);
    } else {
      logger.info(`bsc:Burn ${mintBurn.tokenValue} ${mintBurn.tokenName} in tx ${tx.hash}`);

      const totalToken = await getTotalTokenAmount(mintBurn.tokenName, BURN_EVENT);
      await saveToken(mintBurn, totalToken, BURN_EVENT);
    }
  } catch (error) {
    logger.error('bsc:handleTransferSingleEvent fails %O', error);
  }
}

module.exports = {
  handleMintBurnEvents
};
