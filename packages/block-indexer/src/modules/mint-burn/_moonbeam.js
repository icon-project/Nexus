'use strict';

const Web3 = require('web3');
const debug = require('debug')('moonbeam_tx');
const debugEvmLog = require('debug')('evmlog');
const debugEthTx = require('debug')('eth_tx');
const { logger, ICX_LOOP_UNIT } = require('../../common');
const { getEventMapBSHScore } = require('../moonbeam-indexer/events');
const abiBshScore = require('../moonbeam-indexer/abi/abi.bsh_core.json');
const { saveToken, getTotalTokenAmount } = require('./repository');
const { getTokenName } = require('../tokens/model');

const MINT = 'mint';
const BURN = 'burn';
const web3 = new Web3(process.env.MOONBEAM_API_URL);
const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';
const bshCoreAddress = process.env.MOONBEAM_BSH_CORE_ADDRESS.toLowerCase();

/*
Mint event.

{
        "method": {
          "pallet": "evm",
          "method": "Log"
        },
        "data": [
          {
            "address": "0x7d4567b7257cf869b01a47e8cf0edb3814bdb963", // BSH
            "topics": [
              "0xc3d58168c5ae7397731d063d5bbf3d657854427343f4c083240f7aacaa2d0f62",
              "0x0000000000000000000000009c1da847b31c0973f26b1a2a3d5c04365a867703",
              "0x0000000000000000000000007d4567b7257cf869b01a47e8cf0edb3814bdb963",
              "0x0000000000000000000000000000000000000000000000000000000000000000"
            ],
            "data": "0xa507a47b174bd5e57300fc555418f6e30207d9f78a31298d1c44e17507aa81b2000000000000000000000000000000000000000000000000015fb7f9b8c2bcb0"
          }
        ]
      }
*/
async function handleMintBurnEvents(transaction, block) {
  if ('ethereum' !== transaction.method.pallet || 'transact' !== transaction.method.method)
    return false;

  debugEthTx(transaction);
  const eventMapBSHScore = getEventMapBSHScore();

  // Issue: it might not be 1st event in the list so the check doesn't work.
  //if (bshCoreAddress === transaction.events[0].data[0].address) {
    const transferSingle = eventMapBSHScore.get('TransferSingle');
    const event = findEvmLogByEventHash(transferSingle.hash, transaction.events);

    if (event) {
      logger.info(
        `moonbeam: handleMintBurnEvents get TransferSingle event in tx ${transaction.hash}`,
      );
      await handleTransferSingleEvent(transferSingle, event, transaction, block);
    }
  //}
}

function findEvmLogByEventHash(hash, events) {
  for (const event of events) {
    if ('evm' !== event.method.pallet || 'Log' !== event.method.method) continue;

    debugEvmLog('evm.Log: %O', event);

    if (hash === event.data[0].topics[0]) return event;
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
        networkId: process.env.MOONBEAM_NETWORK_ID,
        txHash: transaction.hash,
        blockHash: block.hash,
        blockHeight: Number(block.number),
        blockTime: Number(block.extrinsics[0].args.now),
      };

      txMintBurnObj.tokenName = getTokenName(process.env.MOONBEAM_NETWORK_ID, txMintBurnObj.tokenId);

      if (!txMintBurnObj.tokenName) {
        logger.warn('moonbeam: handleTransferSingleEvent found an unregistered token ID=%s', txMintBurnObj.tokenId);
        return false;
      }

      if (ZERO_ADDRESS === txMintBurnObj.from) {
        const totalToken = await getTotalTokenAmount(txMintBurnObj.tokenName, MINT);
        await saveToken(txMintBurnObj, totalToken, MINT);
      } else if (bshCoreAddress === txMintBurnObj.to) {
        const totalToken = await getTotalTokenAmount(txMintBurnObj.tokenName, BURN);
        await saveToken(txMintBurnObj, totalToken, BURN);
      }
    }
  } catch (error) {
    logger.error('moonbeam:handleTransferSingleEvent fails %O', error);
  }
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
        value: Number(result.value) / ICX_LOOP_UNIT,
      };

      return data;
    }
  } catch (error) {
    logger.error('moonbeam:getTransferSingleEvent fails: %O', error);
  }
}

module.exports = {
  handleMintBurnEvents,
};
