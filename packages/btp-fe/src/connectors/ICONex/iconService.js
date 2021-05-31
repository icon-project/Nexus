import IconService, {
  HttpProvider,
  IconAmount,
  IconUtil,
  IconConverter,
  IconBuilder,
} from 'icon-sdk-js';
const { IcxTransactionBuilder } = IconBuilder;
const { serialize } = IconUtil;

import { currentICONexNetwork } from '../constants';
import { requestSigning } from './events';
import Request from './utils';

const httpProvider = new HttpProvider(currentICONexNetwork.endpoint);
const iconService = new IconService(httpProvider);

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
  if (!signature) throw new Error('invalid send transaction params');
  const requestId = IconUtil.getCurrentTime();
  const request = new Request(requestId, 'icx_sendTransaction', {
    ...window.rawTransaction,
    signature,
  });
  await httpProvider.request(request).execute();
};

export const signTx = (transaction = {}) => {
  const { from, to, value } = transaction;

  const icxTransactionBuilder = new IcxTransactionBuilder();
  const testTransaction = icxTransactionBuilder
    .from(from || 'hx1441b48a18321354907f3e0821de66fe0dba9ee8')
    .to(to || 'hx61ad540fa5ae0176e92bc2a1095b3d319a6589e8')
    .value(IconConverter.toBigNumber(value || 1 + '000000000000000000'))
    .stepLimit(IconConverter.toBigNumber(100000))
    .nid(IconConverter.toBigNumber('0xc7c937'))
    .nonce(IconConverter.toBigNumber(1))
    .version(IconConverter.toBigNumber(3))
    .timestamp(new Date().getTime() * 1000)
    .build();

  const rawTransaction = IconConverter.toRawTransaction(testTransaction);
  window.rawTransaction = rawTransaction;
  const transactionHash = serialize(rawTransaction);

  requestSigning({
    from: from || 'hx1441b48a18321354907f3e0821de66fe0dba9ee8',
    hash: transactionHash,
  });
};
