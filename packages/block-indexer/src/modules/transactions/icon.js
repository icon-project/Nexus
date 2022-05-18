
'use strict';

const { decode } = require('rlp');
const { IconConverter } = require('icon-sdk-js').default;
const Web3 = require('web3');
const { createLogger, TRANSACTION_STATUS, ICX_LOOP_UNIT, TRANSFER_START_EVENT, TRANSFER_END_EVENT, BUY_TOKEN_EVENT, BUY_TOKEN_END_EVENT } = require('../../common');
const { getRegisteredTokens } = require('../tokens/model');
const { calculateTotalVolume } = require('./model');
const {
  getLatestTransactionByToken,
  findTxBySerialNumber,
  setTransactionConfirmed,
  saveTransaction
} = require('./repository');

const TRANFER_START_PROTOTYPE = 'TransferStart(Address,str,int,bytes)';
const TRANFER_END_PROTOTYPE = 'TransferEnd(Address,int,int,bytes)';
const BUY_TOKENS_PROTOTYPE = 'BuyTokens(int,Address,bytes,int,int,int)';
const BUY_TOKENS_END_PROTOTYPE = 'BuyTokensEnd(int,Address,bytes,str,int,int)';
const web3 = new Web3(process.env.MOONBEAM_API_URL);
const logger = createLogger();
const { logTxHashToSlack } = require('../../slack-bot');
const { getBMCAddressesMap } = require('../common/addresses');

/*
TransferEnd(Address _sender, BigInteger _sn, BigInteger _code, byte[] _msg);
Ref: https://github.com/icon-project/btp/blob/icondao/javascore/nativecoin/src/main/java/foundation/icon/btp/nativecoin/NCSEvents.java#L46
*/
async function confirmTransferEnd(event, txInfo) {
  const data = event.data;

  try {
    const transaction = await findTxBySerialNumber(IconConverter.toNumber(data[0]), process.env.ICON_NETWORK_ID, event.scoreAddress);
    const status = IconConverter.toNumber(data[1]);
    let statusCode = transaction.status;

    switch (status) {
      case 0:
        statusCode = TRANSACTION_STATUS.success;
        break;

      case 1:
        statusCode = TRANSACTION_STATUS.failed;
        break;

      default:
        logger.warn('icon:Unexpected TransferEnd status %d', status);
        break;
    }

    txInfo.error = TRANSACTION_STATUS.failed === statusCode ? web3.utils.hexToUtf8(data[2]) : '';

    // Log a transaction to slack channel when update transaction's status
    logTxHashToSlack(
      transaction.to_address,
      transaction.from_address,
      transaction.tx_hash,
      transaction.block_time,
      transaction.btp_fee,
      transaction.network_fee,
      statusCode,
      transaction.value,
      transaction.network_id,
      TRANSFER_END_EVENT
    );
    await setTransactionConfirmed(transaction, txInfo, statusCode);
  } catch (error) {
    logger.error('icon:confirmTransferEnd failed confirm transaction %O', error);
  }
}

async function handleTransactionEvents(txResult, transaction) {
  if (txResult.eventLogs.length === 0) {
    return false;
  }

  const tokenMap = await getRegisteredTokens();
  const bmcAddressesMap = getBMCAddressesMap();

  if (tokenMap.has(txResult.to)) {
    for (const event of txResult.eventLogs) {
      await handleTransactionStartEvent(event, txResult, transaction);
      await handleBuyTokenEvent(event, txResult, transaction);
    }
  } else if (bmcAddressesMap.has(txResult.to)) {
    for (const event of txResult.eventLogs) {
      await handleTransactionEndEvent(event, txResult);
      await handleBuyTokenEndEvent(event, txResult, transaction);
    }
  }
}

/*
TransferStart(Address _from, String _to, BigInteger _sn, byte[] _assets);

Ref: https://github.com/icon-project/btp/blob/icondao/javascore/nativecoinIRC2/src/main/java/foundation/icon/btp/nativecoinIRC2/NCSEvents.java#L35

 * // struct of assetTransferDetails after decoding
 * [
 *      [
 *         tokenName,
 *         amount,
 *         fee
 *      ]
 * ]
 */
async function handleTransactionStartEvent(event, txResult, transaction) {
  if (TRANFER_START_PROTOTYPE !== event.indexed[0]) {
    return;
  }

  logger.info(`icon:handleTransactionStartEvent get TransferStart event in tx ${txResult.txHash}`);

  const data = event.data;
  const details = decode(data[2])[0];
  const tokenName = details[0].toString('utf8');
  const value = parseInt(details[1].toString('hex'), 16) / ICX_LOOP_UNIT;
  const btpFee = parseInt(details[2].toString('hex'), 16) / ICX_LOOP_UNIT;

  // Ref: https://www.icondev.io/docs/step-estimation#transaction-fee
  const transObj = {
    fromAddress: event.indexed[1],
    tokenName: tokenName,
    serialNumber: IconConverter.toNumber(data[1]),
    value: value,
    toAddress: data[0],
    txHash: txResult.txHash,
    status: TRANSACTION_STATUS.pending,
    blockTime: Math.floor(transaction.timestamp / 1000), // microsecond to millisecond
    networkId: process.env.ICON_NETWORK_ID,
    btpFee: btpFee,
    networkFee: (txResult.stepPrice.c[0] * txResult.stepUsed.c[0]) / ICX_LOOP_UNIT,
    contractAddress: event.scoreAddress // Ref: #426
  };

  // Calculating total volume when the system has a new transaction.
  const latestTransaction = await getLatestTransactionByToken(transObj.tokenName);
  const totalVolume = calculateTotalVolume(transObj, latestTransaction);

  transObj.totalVolume = totalVolume;

  // Log a transaction to slack channel
  logTxHashToSlack(
    transObj.toAddress,
    transObj.fromAddress,
    transObj.txHash,
    transObj.blockTime,
    transObj.btpFee,
    transObj.networkFee,
    transObj.status,
    transObj.value,
    transObj.networkId,
    TRANSFER_START_EVENT
  );
  await saveTransaction(transObj);
}

// TransferEnd(Address _sender, BigInteger _sn, BigInteger _code, byte[] _msg);
async function handleTransactionEndEvent(event, txResult) {
  if (TRANFER_END_PROTOTYPE !== event.indexed[0]) {
    return;
  }
  logger.info(`icon:handleTransactionEndEvent get TransferEnd event in tx ${txResult.txHash}`);
  await confirmTransferEnd(event, { txHash: txResult.txHash });
}

// BuyTokens(int seq_num, Address icx_address, bytes hmy_address, str success_failure_message, int amount, int fee, int icxUSDPrice);
async function handleBuyTokenEvent(event, txResult, transaction) {
  if (BUY_TOKENS_PROTOTYPE !== event.indexed[0]) {
    return;
  }

  logger.info(`icon:handleBuyTokenEvent get BuyTokens event in tx ${txResult.txHash}`);
  const data = event.data;
  const value = parseInt(data[0].toString('hex'), 16) / ICX_LOOP_UNIT;
  const btpFee = parseInt(data[1].toString('hex'), 16) / ICX_LOOP_UNIT;

  // Ref: https://www.icondev.io/docs/step-estimation#transaction-fee
  const transObj = {
    fromAddress: event.indexed[2],
    tokenName: 'ICX',
    serialNumber: IconConverter.toNumber(event.indexed[1]),
    value: value,
    toAddress: `btp://${process.env.HARMONY_NETWORK_ID}.hmny/${event.indexed[3]}`,
    txHash: txResult.txHash,
    status: TRANSACTION_STATUS.pending,
    blockTime: Math.floor(transaction.timestamp / 1000), // microsecond to millisecond
    networkId: process.env.ICON_NETWORK_ID,
    btpFee: btpFee,
    networkFee: (txResult.stepPrice.c[0] * txResult.stepUsed.c[0]) / ICX_LOOP_UNIT,
    contractAddress: event.scoreAddress // Ref: #426
  };
  try {
    // Calculating total volume when the system has a new transaction.
    const latestTransaction = await getLatestTransactionByToken(transObj.tokenName);
    const totalVolume = calculateTotalVolume(transObj, latestTransaction);

    transObj.totalVolume = totalVolume;

    // Log a transaction to slack channel
    logTxHashToSlack(
      transObj.toAddress,
      transObj.fromAddress,
      transObj.txHash,
      transObj.blockTime,
      transObj.btpFee,
      transObj.networkFee,
      transObj.status,
      transObj.value,
      transObj.networkId,
      BUY_TOKEN_EVENT
    );
    await saveTransaction(transObj);
  } catch (error) {
    logger.error('icon:handleBuyTokenEvent failed save transaction %O', error);
  }
}

// BuyTokensEnd(int seq_num,Address icx_address,bytes hmy_address, str success_failure_message, int minted_tokens_count,int refundable_amount)
async function handleBuyTokenEndEvent(event, txResult) {
  if (BUY_TOKENS_END_PROTOTYPE !== event.indexed[0]) {
    return;
  }

  logger.info(`icon:handleBuyTokenEndEvent get BuyTokensEnd event in tx ${txResult.txHash}`);
  const { data } = event;

  try {
    const transaction = await findTxBySerialNumber(IconConverter.toNumber(event.indexed[1]), process.env.ICON_NETWORK_ID, event.scoreAddress);

    if (!transaction) return;

    let statusCode = transaction.status;
    if (data[0] === 'success') {
      statusCode = TRANSACTION_STATUS.success;
    } else {
      statusCode = TRANSACTION_STATUS.failed;
    }

    // Log a transaction to slack channel when update transaction's status
    logTxHashToSlack(
      transaction.to_address,
      transaction.from_address,
      transaction.tx_hash,
      transaction.block_time,
      transaction.btp_fee,
      transaction.network_fee,
      statusCode,
      transaction.value,
      transaction.network_id,
      BUY_TOKEN_END_EVENT
    );

    const txInfo = {
      txHash: txResult.txHash,
      error: TRANSACTION_STATUS.failed === statusCode ? data[0] : ''
    };
    await setTransactionConfirmed(transaction, txInfo, statusCode);
  } catch (error) {
    logger.error('icon:handleBuyTokenEndEvent failed confirm transaction %O', error);
  }
}

module.exports = {
  handleTransactionEvents
};
