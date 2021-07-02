import IconService, {
  HttpProvider,
  IconAmount,
  IconUtil,
  IconConverter,
  IconBuilder,
} from 'icon-sdk-js';
const { IcxTransactionBuilder, CallTransactionBuilder } = IconBuilder;
const { serialize } = IconUtil;

import { currentICONexNetwork, ADDRESS_LOCAL_STORAGE, signingActions } from '../constants';
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
    return await httpProvider.request(request).execute();
  } catch (err) {
    throw new Error(err.message || err);
  }
};

export const getTxResult = (txHash) => {
  try {
    return iconService
      .getTransactionResult(txHash)
      .execute()
      .then((rs) => {
        return rs;
      });
  } catch (err) {
    throw new Error(err.message);
  }
};

export const placeBid = (auctionName, value, fas) => {
  const transaction = {
    to: fas || 'cx97dd9c3e40982bf23ac67b110741323a909a1495', // default FAS addess to our server
    value,
  };

  const options = {
    builder: new CallTransactionBuilder(),
    method: 'bid',
    params: {
      _tokenName: auctionName,
    },
  };

  window[signingActions.globalName] = signingActions.bid;
  signTx(transaction, options);
};

export const transfer = (tx) => {
  window[signingActions.globalName] = signingActions.transfer;
  signTx(tx);
};

export const signTx = (transaction = {}, options = {}) => {
  const { from = loggedInAddress, to, value } = transaction;
  const { method, params, builder } = options;

  const txBuilder = builder || new IcxTransactionBuilder();

  let tx = txBuilder
    .from(from)
    .to(to)
    .value(IconAmount.of(value, IconAmount.Unit.ICX).toLoop())
    .stepLimit(IconConverter.toBigNumber(1000000000))
    .nid(IconConverter.toBigNumber(currentICONexNetwork.nid || '0xc7c937'))
    .nonce(IconConverter.toBigNumber(1))
    .version(IconConverter.toBigNumber(3))
    .timestamp(new Date().getTime() * 1000);

  if (method) {
    tx = tx.method(method).params(params);
  }

  tx = tx.build();

  const rawTx = IconConverter.toRawTransaction(tx);
  window[rawTransaction] = rawTx;
  const transactionHash = serialize(rawTx);

  requestSigning({
    from,
    hash: transactionHash,
  });
};
