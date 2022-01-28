import { IconAmount, IconUtil, IconConverter, IconBuilder } from 'icon-sdk-js';
const { IcxTransactionBuilder, CallTransactionBuilder } = IconBuilder;
const { serialize } = IconUtil;

import { ethers } from 'ethers';

import {
  getCurrentICONexNetwork,
  ADDRESS_LOCAL_STORAGE,
  MOON_BEAM_NODE,
  BSC_NODE,
  signingActions,
  rawTransaction,
  iconService,
  httpProvider,
} from 'connectors/constants';
import { requestSigning } from './events';
import Request, { convertToICX, makeICXCall } from './utils';
import store from 'store';
import { roundNumber } from 'utils/app';
import { connectedNetWorks } from 'utils/constants';
export { transfer } from './transfer';

const { modal } = store.dispatch;

export const serviceName = connectedNetWorks.icon;

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

export const sendNonNativeCoin = () => {
  const transaction = {
    to: getCurrentICONexNetwork().BSHAddress,
  };

  const options = {
    builder: new CallTransactionBuilder(),
    method: 'transfer',
    params: {
      _to: `btp://${MOON_BEAM_NODE.networkAddress}/${window[signingActions.receiver]}`,
      _value: window[rawTransaction].data.params._value,
      _coinName: 'DEV',
    },
  };

  window[signingActions.globalName] = signingActions.transfer;
  signTx(transaction, options);
  return { transaction, options };
};

export const sendNativeCoin = ({ value, to }, networkAddress) => {
  const transaction = {
    to: getCurrentICONexNetwork().BSHAddress,
    value,
  };

  const options = {
    builder: new CallTransactionBuilder(),
    method: 'transferNativeCoin',
    params: {
      _to: `btp://${networkAddress}/${to}`,
    },
  };

  signTx(transaction, options);
  return { transaction, options };
};

export const reclaim = async ({ coinName, value }) => {
  const transaction = {
    to: getCurrentICONexNetwork().BSHAddress,
  };

  const options = {
    builder: new CallTransactionBuilder(),
    method: 'reclaim',
    params: {
      _coinName: coinName,
      _value: IconConverter.toHex(IconAmount.of(value, IconAmount.Unit.ICX).toLoop()),
    },
  };

  signTx(transaction, options);
};

export const transferToERC2 = ({ value, to }) => {
  const transaction = {
    to: getCurrentICONexNetwork().irc2token,
  };

  const options = {
    builder: new CallTransactionBuilder(),
    method: 'transfer',
    params: {
      _to: getCurrentICONexNetwork().BSHAddress,
      _value: IconConverter.toHex(IconAmount.of(value, IconAmount.Unit.ICX).toLoop()),
    },
  };

  window[signingActions.receiver] = to;
  window[signingActions.globalName] = signingActions.approve;
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

export const signTx = (transaction = {}, options = {}) => {
  const { from = localStorage.getItem(ADDRESS_LOCAL_STORAGE), to, value } = transaction;
  const { method, params, builder, nid, timestamp } = options;

  if (!modal.isICONexWalletConnected()) {
    return;
  }

  modal.openModal({
    icon: 'loader',
    desc: 'Waiting for confirmation in your wallet.',
  });

  const txBuilder = builder || new IcxTransactionBuilder();

  let tx = txBuilder
    .from(from)
    .to(to)
    .stepLimit(IconConverter.toBigNumber(3519157719))
    .nid(IconConverter.toBigNumber(nid || getCurrentICONexNetwork().nid))
    .nonce(IconConverter.toBigNumber(1))
    .version(IconConverter.toBigNumber(3))
    .timestamp(timestamp || new Date().getTime() * 1000);

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

  return transactionHash;
};

/**
 * Returns BTP fee
 * @return {string} unit: 1/10000
 * ref: https://github.com/icon-project/btp/blob/iconloop/javascore/nativecoin/src/main/java/foundation/icon/btp/nativecoin/NativeCoinService.java#L40
 */
export const getBTPfee = async () => {
  const fee = await makeICXCall({
    to: getCurrentICONexNetwork().BSHAddress,
    dataType: 'call',
    data: {
      method: 'feeRatio',
    },
  });
  return IconConverter.toNumber(fee);
};

export const getBalanceOf = async ({ address, refundable = false, symbol = 'DEV' }) => {
  try {
    const payload = {
      dataType: 'call',
      to: getCurrentICONexNetwork().irc2token,
      data: {
        method: 'balanceOf',
        params: {
          _owner: address,
        },
      },
    };

    if (refundable) {
      payload.to = getCurrentICONexNetwork().BSHAddress;
      payload.data.params._coinName = symbol;
    }

    const balance = await makeICXCall(payload);

    return refundable
      ? convertToICX(balance.refundable)
      : roundNumber(ethers.utils.formatEther(balance), 6);
  } catch (err) {
    console.log('getBalanceOf err', err);
  }
};

export const depositTokensIntoBSH = (tx) => {
  const transaction = {
    to: getCurrentICONexNetwork().irc2token,
  };

  const options = {
    builder: new CallTransactionBuilder(),
    method: 'transfer',
    params: {
      _to: getCurrentICONexNetwork().TOKEN_BSH_ADDRESS,
      _value: IconConverter.toHex(IconAmount.of(tx.value, IconAmount.Unit.ICX).toLoop()),
    },
  };

  window[signingActions.receiver] = tx.to;
  window[signingActions.globalName] = signingActions.deposit;
  signTx(transaction, options);
};

export const sendNoneNativeCoinBSC = () => {
  const transaction = {
    to: getCurrentICONexNetwork().TOKEN_BSH_ADDRESS,
  };

  const options = {
    builder: new CallTransactionBuilder(),
    method: 'transfer',
    params: {
      tokenName: 'ETH',
      to: `btp://${BSC_NODE.networkAddress}/${window[signingActions.receiver]}`,
      value: window[rawTransaction].data.params._value,
    },
  };

  window[signingActions.globalName] = signingActions.transfer;
  signTx(transaction, options);
};
