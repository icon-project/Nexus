'use strict';

const Web3 = require('web3');
const debug = require('debug')('moonbeam_tx');
const debugEvmLog = require('debug')('evmlog');
const { logger, TRANSACTION_STATUS, ICX_LOOP_UNIT } = require('../../common');
const { getEventMap } = require('../moonbeam-indexer/events');
const { calculateTotalVolume } = require('./model');
const {
  getLatestTransactionByToken,
  getBySerialNumber,
  setTransactionConfirmed,
  saveTransaction
} = require('./repository');

const web3 = new Web3(process.env.MOONBEAM_API_URL);

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
}*/
function getTransferStartEvent(inputs, evmLogData) {
  try {
    const result = web3.eth.abi.decodeLog(inputs, evmLogData.data, evmLogData.topics.slice(1));

    if (result) {
      logger.info('moonbeam:getTransferStartEvent got TransferStart event: %O', result);

      const data = {
        from: result._from.toLowerCase(),
        to: result._to.toLowerCase(),
        sn: result._sn,
        coinName: result._assetDetails[0].coinName,
        value: Number(result._assetDetails[0].value) / ICX_LOOP_UNIT,
        fee: Number(result._assetDetails[0].fee) / ICX_LOOP_UNIT
      };

      return data;
    }
  } catch (error) {
    logger.error('moonbeam:getTransferStartEvent fails: %O', error);
  }
}

/*
info: moonbeam:getTransferEndEvent got TransferEnd event: Result {
  '0': '0x4B0d307675CDae97Fc624E1987B942f4B9483231',
  '1': '1',
  '2': '0',
  '3': 'Transfer Success',
  __length__: 4,
  _from: '0x4B0d307675CDae97Fc624E1987B942f4B9483231',
  _sn: '1',
  _code: '0',
  _response: 'Transfer Success'
}*/
function getTransferEndEvent(inputs, evmLogData) {
  try {
    const result = web3.eth.abi.decodeLog(inputs, evmLogData.data, evmLogData.topics.slice(1));

    if (result) {
      logger.info('moonbeam:getTransferEndEvent got TransferEnd event: %O', result);

      const data = {
        from: result._from.toLowerCase(),
        sn: result._sn,
        code: Number(result._code),
        response: result._response
      };

      return data;
    }
  } catch (error) {
    logger.error('moonbeam:getTransferEndEvent fails: %O', error);
  }
}

/** https://git.baikal.io/icon/btp/-/blob/develop/solidity/bsh/contracts/BSHPeriphery.sol#L40
 *    @notice Sends a receipt to user
  The `_from` sender
  The `_to` receiver.
  The `_sn` sequence number of service message.
  The `_assetDetails` a list of `_coinName` and `_value`

event TransferStart(
  address indexed _from,
  string _to,
  uint256 _sn,
  Types.AssetTransferDetail[] _assetDetails
);*/
async function handleTransferStartEvent(transferStart, evmLogEvent, transaction, block) {
  try {
    logger.info(`moonbeam:handleTransferStartEvent in tx hash: ${transaction.hash}`);
    const event = getTransferStartEvent(transferStart.event.inputs, evmLogEvent.data[0]);

    if (event) {
      let txData = {
        fromAddress: event.from,
        toAddress: event.to,
        tokenName: event.coinName,
        value: event.value,
        btpFee: event.fee,
        serialNumber: event.sn,
        txHash: transaction.hash,
        blockHeight: Number(block.number),
        status: TRANSACTION_STATUS.pending,
        blockTime: Number(block.extrinsics[0].args.now),
        networkId: process.env.MOONBEAM_NETWORK_ID,
        networkFee: 0 // NA
      };

      let latestTransaction = await getLatestTransactionByToken(txData.tokenName);
      const totalVolume = calculateTotalVolume(txData, latestTransaction);

      txData.totalVolume = totalVolume;
      await saveTransaction(txData);
    }
  } catch (error) {
    logger.error(`moonbeam:handleTransferStartEvent fails: ${error.message} in tx ${transaction.hash}, block ${block.hash}`);
  }
}

/**   @notice Sends a final notification to a user
    The `_from` sender
    The `_sn` sequence number of service message.
    The `_code` response code, i.e. RC_OK = 0, RC_ERR = 1
    The `_response` message of response if error

event TransferEnd(
  address indexed _from,
  uint256 _sn,
  uint256 _code,
  string _response
);
*/
async function handleTransferEndEvent(transferEnd, evmLogEvent, transaction, block) {
  try {
    logger.info(`handleTransferEndEvent in tx hash: ${transaction.hash}`);

    const event = getTransferEndEvent(transferEnd.event.inputs, evmLogEvent.data[0]);

    if (event) {
      const statusCode = 0 === event.code ? TRANSACTION_STATUS.success : TRANSACTION_STATUS.failed;
      let updatingTx = await getBySerialNumber(event.sn, process.env.MOONBEAM_NETWORK_ID);

      // Issue: need to keep hashes of both start and end transactions.
      const txData = {
        txHash: transaction.hash,
        blockHeight: Number(block.number),
        error: TRANSACTION_STATUS.failed === statusCode ? event.response : ''
      };

      await setTransactionConfirmed([updatingTx], txData, statusCode);
    }
  } catch (error) {
    logger.error(`moonbeam:handleTransferEndEvent fails: ${error.message} in tx ${transaction.hash}, block ${block.hash}`);
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

async function handleTransactionEvents(transaction, block) {
  // Only interested in Ethereum transactions.
  if ('ethereum' !== transaction.method.pallet || 'transact' !== transaction.method.method)
    return false;

  const eventMap = getEventMap();

  // Only interested in transaction of a specific contract
  // BSH core for TransferStart event.
  if (transaction.args.transaction && process.env.MOONBEAM_BSH_CORE_ADDRESS === transaction.args.transaction.action.call) {
    debug('Transaction: %O', transaction);

    // Is it TransferStart?
    const transferStart = eventMap.get('TransferStart');
    const event = findEvmLogByEventHash(transferStart.hash, transaction.events);

    if (event) {
      logger.info(`Get TransferStart event in tx ${transaction.hash}, block ${block.hash}`);
      await handleTransferStartEvent(transferStart, event, transaction, block);
    }
  } else if (transaction.args.transaction && process.env.MOONBEAM_BMC_ADDRESS === transaction.args.transaction.action.call) {
    // BMC for TransferEnd event.
    debug('Transaction: %O', transaction);

    // Is it TransferEnd?
    const transferEnd = eventMap.get('TransferEnd');
    const event = findEvmLogByEventHash(transferEnd.hash, transaction.events);

    if (event) {
      logger.info(`Get TransferEnd event in tx ${transaction.hash}, block ${block.hash}`);
      await handleTransferEndEvent(transferEnd, event, transaction, block);
    }
  }

  return true;
}

module.exports = {
  handleTransactionEvents
};
