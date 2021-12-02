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
import { isICONAndBSHPaired, connectedNetWorks } from 'utils/constants';

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

export const sendNoneNativeCoin = ({ value, to }) => {
  const transaction = {
    to: getCurrentICONexNetwork().BSHAddress,
  };

  const options = {
    builder: new CallTransactionBuilder(),
    method: 'transfer',
    params: {
      _to: `btp://${MOON_BEAM_NODE.networkAddress}/${to}`,
      _value: IconConverter.toHex(IconAmount.of(value, IconAmount.Unit.ICX).toLoop()),
      _coinName: 'DEV',
    },
  };

  signTx(transaction, options);
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
};

export const setApprovalForAll = async () => {
  const transaction = {
    to: getCurrentICONexNetwork().irc31token,
  };

  const options = {
    builder: new CallTransactionBuilder(),
    method: 'setApprovalForAll',
    params: {
      _operator: getCurrentICONexNetwork().BSHAddress,
      _approved: '0x1',
    },
  };

  window[signingActions.globalName] = signingActions.transfer;
  signTx(transaction, options);
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

export const isApprovedForAll = async (address) => {
  const result = await makeICXCall({
    to: getCurrentICONexNetwork().irc31token,
    dataType: 'call',
    data: {
      method: 'isApprovedForAll',
      params: {
        _operator: getCurrentICONexNetwork().BSHAddress,
        _owner: address || localStorage.getItem(ADDRESS_LOCAL_STORAGE),
      },
    },
  });
  return result === '0x1';
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

export const transfer = (tx, isSendingNativeCoin, network) => {
  window[signingActions.globalName] = signingActions.transfer;
  const networkAddress = BSC_NODE[network]
    ? BSC_NODE.networkAddress
    : MOON_BEAM_NODE.networkAddress;

  if (isSendingNativeCoin) {
    sendNativeCoin(tx, networkAddress);
  } else {
    if (isICONAndBSHPaired) depositTokensIntoBSH(tx);
    else sendNoneNativeCoin(tx);
  }
};

export const signTx = (transaction = {}, options = {}) => {
  const { from = localStorage.getItem(ADDRESS_LOCAL_STORAGE), to, value } = transaction;
  const { method, params, builder } = options;

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
    .stepLimit(IconConverter.toBigNumber(1000000000))
    .nid(IconConverter.toBigNumber(getCurrentICONexNetwork().nid))
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
    let balance = 0;

    if (symbol === 'ETH') {
      balance = await makeICXCall({
        dataType: 'call',
        to: getCurrentICONexNetwork().irc2token,
        data: {
          method: 'balanceOf',
          params: {
            _owner: address,
          },
        },
      });
    } else {
      const coinId = await makeICXCall({
        to: getCurrentICONexNetwork().BSHAddress,
        dataType: 'call',
        data: {
          method: 'coinId',
          params: {
            _coinName: symbol,
          },
        },
      });

      const params = {
        dataType: 'call',
        data: {
          method: 'balanceOf',
          params: {
            _owner: address,
          },
        },
      };

      if (refundable) {
        params.to = getCurrentICONexNetwork().BSHAddress;
        params.data.params._coinName = coinId;
      } else {
        params.to = getCurrentICONexNetwork().irc31token;
        params.data.params._id = coinId;
      }

      balance = await makeICXCall(params);
    }

    return refundable
      ? convertToICX(balance.refundable)
      : roundNumber(ethers.utils.formatEther(balance), 6);
  } catch (err) {
    console.log('err', err);
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
