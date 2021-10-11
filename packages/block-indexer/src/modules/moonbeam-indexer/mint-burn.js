
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
      logger.info(`moonbeam: handleMintBurnEvents get TransferSingle event in tx ${transaction.hash}`);
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
        tokenId: event.id.startsWith('0x') ? event.id : '0x' + event.id,
        to: event.to,
        from: event.from,
        txHash: transaction.hash,
        blockHash: block.hash,
        blockHeight: Number(block.number),
        blockTime: Number(block.extrinsics[0].args.now),
      };

      // It's weird that ID returned here from contract does not have 0x prefix.
      // Will be fixed in $402
      txMintBurnObj.tokenName = await getTokenNameById(event.id);

      if (!txMintBurnObj.tokenName) {
        return false;
      }

      if (ZERO_ADDRESS === txMintBurnObj.from) {
        const totalToken = await getTotalTokenMinted(txMintBurnObj.tokenName);
        await saveMintEvent(txMintBurnObj, totalToken);
      } else if (bshCoreAddress === txMintBurnObj.to) {
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

/*
info: moonbeam:getTransferSingleEvent get TransferSingle event Result {
  '0': '0x7d4567B7257cf869B01a47E8cf0EDB3814bDb963',
  '1': '0xF8aC273f62F2D1D7283be823400e05Aeddc389F5',
  '2': '0x7d4567B7257cf869B01a47E8cf0EDB3814bDb963',
  '3': '74645123150620096120801602238006067452189572593452417212166420008730219938226',
  '4': '100000000000000000',
  __length__: 5,
  operator: '0x7d4567B7257cf869B01a47E8cf0EDB3814bDb963',
  from: '0xF8aC273f62F2D1D7283be823400e05Aeddc389F5',
  to: '0x7d4567B7257cf869B01a47E8cf0EDB3814bDb963',
  id: '74645123150620096120801602238006067452189572593452417212166420008730219938226',
  value: '100000000000000000'
}
*/
function getTransferSingleEvent(inputs, evmLogData) {
  try {
    const result = web3.eth.abi.decodeLog(inputs, evmLogData.data, evmLogData.topics.slice(1));

    if (result) {
      logger.info('moonbeam:getTransferSingleEvent get TransferSingle event %O', result);

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
