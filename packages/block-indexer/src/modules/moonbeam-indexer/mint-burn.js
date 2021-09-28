
'use strict';

const Web3 = require('web3');
const debug = require('debug')('moonbeam_tx');
const debugEvmLog = require('debug')('evmlog');
const debugEthTx = require('debug')('eth_tx');
const { logger, ICX_LOOP_UNIT } = require('../../common');
const { getEventMapBSHScore } = require('./events');
const { saveBurnEvent, saveMintEvent, getTotalTokenBurned, getTotalTokenMinted } = require('./repository');
const abiBSHScore= require('./abi/BSHScore.abi.json');

const web3 = new Web3(process.env.MOONBEAM_API_URL);
const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';
const bshCoreAddress = process.env.MOONBEAM_BSH_CORE_ADDRESS.toLowerCase();

async function handleMintBurnEvents(transaction, block) {
  if ('ethereum' !== transaction.method.pallet || 'transact' !== transaction.method.method)
    return false;

  debugEthTx(transaction);
  const eventMapBSHScore = getEventMapBSHScore();

  if (bshCoreAddress === transaction.events[0].data[0].address) {
    const transferSingle = eventMapBSHScore.get('TransferSingle');
    const event = findEvmLogByEventHash(transferSingle.hash, transaction.events);

    if (event) {
      logger.info(`moonbeam: TransferSingle event in tx ${transaction.hash}`);
      await handleTransferSingleEvent(transferSingle, event, transaction, block);
    }
  }
}

function findEvmLogByEventHash(hash, events) {
  for (const event of events) {
    if ('evm' !== event.method.pallet || 'Log' !== event.method.method)
      continue;

    debugEvmLog('evm.Log: %O', event);

    if (hash === event.data[0].topics[0])
      return event;
  }
}

async function handleTransferSingleEvent(transferSingle, evmLogEvent, transaction, block) {
  try {
    const event = getTransferSingleEvent(transferSingle.event.inputs, evmLogEvent.data[0]);

    if (event) {
      let txMintBurnObj = {
        tokenValue: event.value,
        tokenId: event.id,
        to: event.to,
        from: event.from,
        txHash: transaction.hash,
        blockHash: block.hash,
        blockHeight: Number(block.number),
        blockTime: Number(block.extrinsics[0].args.now),
      };

      txMintBurnObj.tokenName = await getTokenNameById(event.id);

      if (!txMintBurnObj.tokenName) {
        return false;
      }

      if (ZERO_ADDRESS === txMintBurnObj.from) {
        const totalToken = await getTotalTokenMinted(txMintBurnObj.tokenName);
        await saveMintEvent(txMintBurnObj, totalToken);
      } else if (process.env.MOONBEAM_BSH_CORE_ADDRESS === txMintBurnObj.to) {
        const totalToken = await getTotalTokenBurned(txMintBurnObj.tokenName);
        await saveBurnEvent(txMintBurnObj, totalToken);
      }
    }
  } catch (error) {
    logger.error('moonbeam:handleTransferSingleEvent fails %O', error);
  }
}

// Issue: it needs to query db of registered tokens.
// Need to be changed in https://github.com/icon-project/btp-dashboard/issues/386
async function getTokenNameById(id) {
  const BSHContract = new web3.eth.Contract(abiBSHScore, process.env.MOONBEAM_BSH_CORE_ADDRESS);
  const tokenNames = await BSHContract.methods.coinNames().call();

  for (let name of tokenNames) {
    const tokenId = await BSHContract.methods.coinId(name).call();
    if (id === tokenId)
      return name;
  }

  return false;
}

function getTransferSingleEvent(inputs, evmLogData) {
  try {
    const result = web3.eth.abi.decodeLog(inputs, evmLogData.data, evmLogData.topics.slice(1));

    if (result) {
      logger.info('moonbeam:getTransferSingleEvent got TransferStart event: %O', result);

      const data = {
        from: result.from.toLowerCase(),
        to: result.to.toLowerCase(),
        id: result.id,
        value: Number(result.value) / ICX_LOOP_UNIT
      };

      return data;
    }
  } catch (error) {
    logger.error('moonbeam:getTransferSingleEvent fails: %O', error);
  }
}

module.exports = {
  handleMintBurnEvents
};
