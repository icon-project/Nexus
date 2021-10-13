'use strict';

const Web3 = require('web3');
const debug = require('debug')('bsc_tx');
const { logger, ICX_LOOP_UNIT, CONTRACT_ZERO_ADDRESS } = require('../../common');
const { findEventByName, decodeEventLog, getBscEventMap } = require('../common/events');
const { getTokenNameById, saveBurnEvent, saveMintEvent, getTotalTokenBurned, getTotalTokenMinted } = require('../tokens/repository');
const { getTokenContractMap } = require('../transactions/model');

const web3 = new Web3(process.env.BSC_API_URL);

async function handleMintBurnEvents(tx, receipt) {
  const eventMap = getBscEventMap();
  const contractMap = await getTokenContractMap();

  if (contractMap.has(tx.to.toLowerCase())) {
    const transferSingle = findEventByName('TransferSingle', eventMap, receipt.logs);

    if (transferSingle) {
      logger.info(`bsc:handleMintBurnEvents get TransferSingle event in tx ${tx.hash}`);

      const eventData = decodeEventLog(web3, eventMap, 'TransferSingle', transferSingle);
      await handleTransferSingleEvent(eventData, tx);
    }
  }
}

async function handleTransferSingleEvent(eventData, tx) {
  try {
    const tokenName = await getTokenNameById(eventData.id);

    const mintBurn = {
      tokenId: eventData.id,
      tokenName,
      tokenValue: Number(result.value) / ICX_LOOP_UNIT,
      to: eventData.to,
      from: eventData.from,
      txHash: tx.hash
    };

    if (CONTRACT_ZERO_ADDRESS === mintBurn.from) {
      const totalToken = await getTotalTokenMinted(mintBurn.tokenName);
      await saveMintEvent(mintBurn, totalToken);
    } else {
      const totalToken = await getTotalTokenBurned(mintBurn.tokenName);
      await saveBurnEvent(mintBurn, totalToken);
    }
  } catch (error) {
    logger.error('bsc:handleTransferSingleEvent fails %O', error);
  }
}

module.exports = {
  handleMintBurnEvents
};
