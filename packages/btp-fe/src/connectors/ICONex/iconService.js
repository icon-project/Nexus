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
import Request, { convertToICX } from './utils';
import store from 'store';

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
      return convertToICX(balance);
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

export const sendNativeCoin = () => {
  const transaction = {
    to: currentICONexNetwork.BSHAddress,
    value: 1,
  };

  const options = {
    builder: new CallTransactionBuilder(),
    method: 'transferNativeCoin',
    params: {
      _to: 'btp://0x501.pra/0x5Aa12918084d969caddA6b31c509E44127FBa0A1',
    },
  };

  signTx(transaction, options);
};

export const placeBid = (auctionName, value, fas) => {
  const transaction = {
    to: fas || 'cxe3d36b26abbe6e1005eacf7e1111d5fefbdbdcad', // default FAS addess to our server
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

  if (!store.dispatch.modal.isICONexWalletConnected()) {
    return;
  }

  const txBuilder = builder || new IcxTransactionBuilder();

  let tx = txBuilder
    .from(from)
    .to(to)
    .value(IconAmount.of(value, IconAmount.Unit.ICX).toLoop())
    // .value(value)
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

/**
 * Returns BTP fee
 * @return {string} unit: 1/10000
 * ref: https://github.com/icon-project/btp/blob/iconloop/javascore/nativecoin/src/main/java/foundation/icon/btp/nativecoin/NativeCoinService.java#L40
 */
export const getBTPfee = async () => {
  try {
    const requestId = IconUtil.getCurrentTime();
    const request = new Request(requestId, 'icx_call', {
      to: currentICONexNetwork.BSHAddress,
      dataType: 'call',
      data: {
        method: 'getFeeRate', // lasted function is feeRatio
      },
    });

    const result = await httpProvider.request(request).execute();
    return IconConverter.toNumber(result);
  } catch (err) {
    console.log('err', err);
    return 0;
  }
};
