'use strict';

const Web3 = require('web3');
const debug = require('debug')('web3_tx');
const { createLogger, TRANSACTION_STATUS, ICX_LOOP_UNIT, TRANSFER_START_EVENT, TRANSFER_END_EVENT } = require('../../common');
const { findEventByName, decodeEventLog } = require('../common/events');
const { getRegisteredTokens } = require('../tokens/model');
const { calculateTotalVolume } = require('./model');
const { getLatestTransactionByToken, findTxBySerialNumber, setTransactionConfirmed, saveTransaction } = require('./repository');

const logger = createLogger();

class Web3TransactionHandler {
  constructor(config) {
    this.config = { ...config };
    this.config.bmcAddress = config.bmcAddress.toLowerCase();
    this.web3 = new Web3(config.endpointUrl);
  }

  async run(tx, receipt, block) {
    const txTo = tx.to.toLowerCase();
    const tokenMap = await getRegisteredTokens();

    if (tokenMap.has(txTo)) {
      const tsEvent = findEventByName(TRANSFER_START_EVENT, this.config.eventMap, receipt.logs);

      if (tsEvent) {
        logger.info(`${this.config.name}:run get ${TRANSFER_START_EVENT} event in tx ${tsEvent.id}, ${tx.hash}`);

        const ts = decodeEventLog(this.web3, this.config.eventMap, TRANSFER_START_EVENT, tsEvent);
        await this.handleTransferStartEvent({
          ...ts,
          logId: tsEvent.id,
          contractAddress: tsEvent.address
        }, tx, receipt, block);
      }
    } else if (this.config.bmcAddress === txTo) {
      const teEvent = findEventByName(TRANSFER_END_EVENT, this.config.eventMap, receipt.logs);

      if (teEvent) {
        logger.info(`${this.config.name}:run get ${TRANSFER_END_EVENT} event in tx ${teEvent.id}, ${tx.hash}`);

        const te = decodeEventLog(this.web3, this.config.eventMap, TRANSFER_END_EVENT, teEvent);
        await this.handleTransferEndEvent({
          ...te,
          logId: teEvent.id,
          contractAddress: teEvent.address
        }, tx);
      }
    }
  }

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
  async handleTransferStartEvent(event, tx, receipt, block) {
    try {
      const txData = {
        fromAddress: event._from.toLowerCase(),
        toAddress: event._to,
        tokenName: event._assetDetails[0].coinName,
        value: Number(event._assetDetails[0].value) / ICX_LOOP_UNIT,
        btpFee: Number(event._assetDetails[0].fee) / ICX_LOOP_UNIT,
        serialNumber: event._sn,
        txHash: tx.hash,
        logId: event.logId,
        status: TRANSACTION_STATUS.pending,
        blockTime: this.web3.utils.hexToNumber(block.timestamp) * 1000,
        networkId: this.config.networkId,
        networkFee: (Number(tx.gasPrice) * receipt.gasUsed) / ICX_LOOP_UNIT,
        contractAddress: event.contractAddress
      };

      const latestTransaction = await getLatestTransactionByToken(txData.tokenName);
      const totalVolume = calculateTotalVolume(txData, latestTransaction);

      txData.totalVolume = totalVolume;
      await saveTransaction(txData);
    } catch (error) {
      logger.error(`${this.config.name}:handleTransferStartEvent fails: ${error.message} in tx ${tx.hash}`);
    }
  }

  /*
  TransferEnd event: Result {
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
  );*/
  async handleTransferEndEvent(event, tx) {
    try {
      const statusCode = 0 === Number(event._code) ? TRANSACTION_STATUS.success : TRANSACTION_STATUS.failed;
      const updatingTx = await findTxBySerialNumber(event._sn, this.config.networkId, event.contractAddress);

      const txData = {
        txHash: tx.hash,
        logId: event.logId,
        error: TRANSACTION_STATUS.failed === statusCode ? event._response : ''
      };

      await setTransactionConfirmed([updatingTx], txData, statusCode);
    } catch (error) {
      logger.error(`${this.config.name}:handleTransferEndEvent fails: ${error.message} in tx ${tx.hash}`);
    }
  }
}

module.exports = {
  Web3TransactionHandler
};
