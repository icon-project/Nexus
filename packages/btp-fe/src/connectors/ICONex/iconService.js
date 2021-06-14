import IconService, {
  HttpProvider,
  IconAmount,
  IconUtil,
  IconConverter,
  IconBuilder,
} from 'icon-sdk-js';
const { IcxTransactionBuilder, CallTransactionBuilder } = IconBuilder;
const { serialize } = IconUtil;

import { currentICONexNetwork, ADDRESS_LOCAL_STORAGE } from '../constants';
import { requestSigning } from './events';
import Request from './utils';

const httpProvider = new HttpProvider(currentICONexNetwork.endpoint);
const iconService = new IconService(httpProvider);

const rawTransaction = 'rawTransaction';
const loggedInAddress = localStorage.getItem(ADDRESS_LOCAL_STORAGE);

export const getBalance = (address) => {
  // https://github.com/icon-project/icon-sdk-js/issues/26#issuecomment-843988076
  return iconService
    .getBalance(address)
    .execute()
    .then((balance) => {
      return IconAmount.of(balance, IconAmount.Unit.LOOP)
        .convertUnit(IconAmount.Unit.ICX)
        .toString();
    });
};

export const sendTransaction = async (signature) => {
  try {
    if (!signature) throw new Error('invalid send transaction params');
    const requestId = IconUtil.getCurrentTime();
    const request = new Request(requestId, 'icx_sendTransaction', {
      ...window[rawTransaction],
      signature,
    });
    await httpProvider.request(request).execute();
  } catch (err) {
    throw new Error(err.message);
  }
};

export const placeBid = (value, fas) => {
  const transaction = {
    value,
    to: fas || 'cx77e574ce4b9020e6676ad6dbdb63a1ba7ca38d6d',
  };

  const icxTransactionBuilder = new CallTransactionBuilder();
  const tx = icxTransactionBuilder
    .from(loggedInAddress)
    .to(fas || 'cx77e574ce4b9020e6676ad6dbdb63a1ba7ca38d6d')
    .value(IconAmount.of(value, IconAmount.Unit.ICX).toLoop())
    .stepLimit(IconConverter.toBigNumber(100000))
    .nid(IconConverter.toBigNumber(currentICONexNetwork.nid || '0xc7c937'))
    .nonce(IconConverter.toBigNumber(1))
    .version(IconConverter.toBigNumber(3))
    .timestamp(new Date().getTime() * 1000)
    .method('bid')
    .params({
      _tokenName: 'Shark',
    })
    .build();

  signTx(transaction, tx);
};

export const signTx = (transaction = {}, builtTx) => {
  const { from = loggedInAddress, to, value } = transaction;

  let tx = builtTx;

  if (!tx) {
    tx = new IcxTransactionBuilder()
      .from(from)
      .to(to)
      .value(IconAmount.of(value, IconAmount.Unit.ICX).toLoop())
      .stepLimit(IconConverter.toBigNumber(100000))
      .nid(IconConverter.toBigNumber(currentICONexNetwork.nid || '0xc7c937'))
      .nonce(IconConverter.toBigNumber(1))
      .version(IconConverter.toBigNumber(3))
      .timestamp(new Date().getTime() * 1000)
      .build();
  }

  const rawTx = IconConverter.toRawTransaction(tx);
  window[rawTransaction] = rawTx;
  const transactionHash = serialize(rawTx);

  requestSigning({
    from,
    hash: transactionHash,
  });
};
