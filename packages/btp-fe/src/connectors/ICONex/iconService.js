import IconService, { IconAmount, IconUtil, IconConverter, IconBuilder } from 'icon-sdk-js';
const { IcxTransactionBuilder, CallTransactionBuilder } = IconBuilder;
const { serialize } = IconUtil;

import { ethers } from 'ethers';

import {
  currentICONexNetwork,
  ADDRESS_LOCAL_STORAGE,
  MOON_BEAM_NODE,
  signingActions,
} from '../constants';
import { requestSigning } from './events';
import Request, { convertToICX, httpProvider, makeICXCall } from './utils';
import store from 'store';
import { connectedNetWorks } from 'utils/constants';
import { roundNumber } from 'utils/app';

const iconService = new IconService(httpProvider);
const rawTransaction = 'rawTransaction';

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

export const sendNoneNativeCoin = ({ value, to, coinName }) => {
  const transaction = {
    to: currentICONexNetwork.BSHAddress,
    // value,
  };

  const options = {
    builder: new CallTransactionBuilder(),
    method: 'transfer',
    params: {
      _to: `btp://${MOON_BEAM_NODE.networkAddress}/${to}`,
      _value: IconConverter.toHex(IconAmount.of(value, IconAmount.Unit.ICX).toLoop()),
      _coinName: coinName,
    },
  };

  signTx(transaction, options);
};

export const sendNativeCoin = ({ value, to }) => {
  const transaction = {
    to: currentICONexNetwork.BSHAddress,
    value,
  };

  const options = {
    builder: new CallTransactionBuilder(),
    method: 'transferNativeCoin',
    params: {
      _to: `btp://${MOON_BEAM_NODE.networkAddress}/${to}`,
    },
  };

  signTx(transaction, options);
};

export const setApprovalForAll = async () => {
  const transaction = {
    to: currentICONexNetwork.irc31token,
  };

  const options = {
    builder: new CallTransactionBuilder(),
    method: 'setApprovalForAll',
    params: {
      _operator: 'hxcf3af6a05c8f1d6a8eb9f53fe555f4fdf4316262',
      _approved: '0x1',
    },
  };

  window[signingActions.globalName] = signingActions.transfer;
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

export const transfer = (tx, network, sendNativeCoin) => {
  window[signingActions.globalName] = signingActions.transfer;

  // same ICON chain
  if (network === connectedNetWorks.icon) {
    signTx(tx);
  } else {
    if (sendNativeCoin) {
      sendNativeCoin(tx);
    } else {
      sendNoneNativeCoin(tx);
    }
  }
};

export const signTx = (transaction = {}, options = {}) => {
  const { from = localStorage.getItem(ADDRESS_LOCAL_STORAGE), to, value } = transaction;
  const { method, params, builder } = options;

  if (!store.dispatch.modal.isICONexWalletConnected()) {
    return;
  }

  const txBuilder = builder || new IcxTransactionBuilder();

  let tx = txBuilder
    .from(from)
    .to(to)
    .stepLimit(IconConverter.toBigNumber(1000000000))
    .nid(IconConverter.toBigNumber(currentICONexNetwork.nid))
    .nonce(IconConverter.toBigNumber(1))
    .version(IconConverter.toBigNumber(3))
    .timestamp(new Date().getTime() * 1000);

  if (value) {
    tx = tx.value(IconAmount.of(value, IconAmount.Unit.ICX).toLoop());
  }

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
  const fee = await makeICXCall({
    to: currentICONexNetwork.BSHAddress,
    dataType: 'call',
    data: {
      method: 'feeRatio',
    },
  });
  return IconConverter.toNumber(fee);
};

export const getBalanceOf = async (address, symbol = 'DEV') => {
  try {
    const coinId = await makeICXCall({
      to: currentICONexNetwork.BSHAddress,
      dataType: 'call',
      data: {
        method: 'coinId',
        params: {
          _coinName: symbol,
        },
      },
    });

    const balance = await makeICXCall({
      to: currentICONexNetwork.irc31token,
      dataType: 'call',
      data: {
        method: 'balanceOf',
        params: {
          _owner: address,
          _id: coinId,
        },
      },
    });

    return roundNumber(ethers.utils.formatUnits(balance, 'ether'), 6);
  } catch (err) {
    console.log('err', err);
  }
};
