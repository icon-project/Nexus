'use strict';

const Web3 = require('web3');
const debug = require('debug')('moonbeam_tx');
const debugEvmLog = require('debug')('evmlog');
const { logger } = require('../../common');
const { getEventMap } = require('./events');

const web3 = new Web3(process.env.MOONBEAM_API_URL);

function getTransferStartEventData(inputs, evmLogData) {
  try {
    const result = web3.eth.abi.decodeLog(inputs, evmLogData.data, evmLogData.topics.slice(1));

    if (result) {
      /*
        {
        '0': '0x4B0d307675CDae97Fc624E1987B942f4B9483231',
        '1': 'btp://0x3.icon/hxcf3af6a05c8f1d6a8eb9f53fe555f4fdf4316262',
        '2': '1',
        '3': [
          [
            'DEV',
            '990000000000000000',
            '10000000000000000',
            coinName: 'DEV',
            value: '990000000000000000',
            fee: '10000000000000000'
          ]
        ],
        __length__: 4,
        _from: '0x4B0d307675CDae97Fc624E1987B942f4B9483231',
        _to: 'btp://0x3.icon/hxcf3af6a05c8f1d6a8eb9f53fe555f4fdf4316262',
        _sn: '1',
        _assetDetails: [
          [
            'DEV',
            '990000000000000000',
            '10000000000000000',
            coinName: 'DEV',
            value: '990000000000000000',
            fee: '10000000000000000'
          ]
        ]
      }
      */
      logger.info('TransferStart event: %O', result);

      // TODO: convert raw event in `result` to required event object.
      const eventData = {};

      return eventData;
    }
  }
  catch (error) {
    logger.error('moonbeam:getTransferStartEventData fails: %O', error);
  }
}

async function handleTransferEvents(transaction, block) {
  // Only interested in Ethereum transactions.
  if ('ethereum' !== transaction.method.pallet || 'transact' !== transaction.method.method)
    return false;

  // Only interested in transaction of a specific contract, here is BSH core.
  if (!transaction.args.transaction || process.env.MOONBEAM_BSH_CORE_ADDRESS !== transaction.args.transaction.action.call)
    return false;

  debug('Transaction: %O', transaction);

  const eventMap = getEventMap();
  const transferStart = eventMap.get('TransferStart');

  for (const event of transaction.events) {
    // Only interested in evm.Log which contains contract's events e.g. TransferStart
    if ('evm' !== event.method.pallet || 'Log' !== event.method.method)
      continue;

    debugEvmLog('evm.Log: %O', event);

    // Is it TransferStart?
    if (transferStart.hash === event.data[0].topics[0]) {
      logger.info(`Get TransferStart event in tx hash ${transaction.hash}`);

      const eventData = getTransferStartEventData(transferStart.event.inputs, event.data[0]);

      if (eventData) {
        // TODO: got expected event data, further handling goes here.
      }
    }
  }
}

module.exports = {
  handleTransferEvents
};
