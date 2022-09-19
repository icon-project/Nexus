import { IconUtil, IconConverter, IconBuilder, HttpProvider } from 'icon-sdk-js';
const { IcxTransactionBuilder, CallTransactionBuilder } = IconBuilder;
const { serialize } = IconUtil;

import { ethers } from 'ethers';

import {
  ADDRESS_LOCAL_STORAGE,
  signingActions,
  rawTransaction,
  txPayload,
  iconService,
  httpProvider,
} from 'connectors/constants';
import { chainConfigs, formatSymbol } from 'connectors/chainConfigs';

import { requestSigning } from './events';
import Request, {
  convertToICX,
  convertToLoopUnit,
  makeICXCall,
  getICONBSHAddressforEachChain,
} from './utils';
import store from 'store';
import { roundNumber } from 'utils/app';
export { transfer } from './transfer';

const { modal } = store.dispatch;
const ICONchain = chainConfigs.ICON || {};
export const serviceName = ICONchain.id;

/**
 * Get balance from an ICON address
 * @param {string} address The ICON address
 * @returns {string} balance in a user-friendly format
 */
export const getBalance = (address) => {
  // https://github.com/icon-project/icon-sdk-js/issues/26#issuecomment-843988076
  return iconService
    .getBalance(address)
    .execute()
    .then((balance) => {
      return convertToICX(balance);
    });
};

/**
 * Send a transaction to ICON network
 * @param {string} signature The signature for the payload
 */
export const sendTransaction = async (signature) => {
  try {
    if (!signature || !window[rawTransaction]) throw new Error('invalid send transaction params');

    const request = new Request('icx_sendTransaction', {
      ...window[rawTransaction],
      signature,
    });

    return await httpProvider.request(request).execute();
  } catch (err) {
    throw new Error(err.message || err);
  }
};

export const estimateStep = async (tx) => {
  try {
    const request = new Request('debug_estimateStep', tx);
    return await new HttpProvider(chainConfigs.ICON?.RPC_URL + '/debug/v3')
      .request(request)
      .execute();
  } catch (err) {
    console.error(err);
    return null;
  }
};

/**
 * Get transaction result
 * https://www.icondev.io/icon-node/goloop/json-rpc/jsonrpc_v3#icx_gettransactionresult
 * @param {string} txHash Transaction hash
 */
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

/**
 * Set approval for sending non-native token
 * @param {object} tx Transaction object
 */
export const setApproveForSendNonNativeCoin = async (tx) => {
  const { coinName, value, network } = tx;
  const bshAddress = await getBSHAddressOfCoinName(coinName);

  const transaction = {
    to: bshAddress,
  };

  const options = {
    builder: new CallTransactionBuilder(),
    method: 'approve',
    params: {
      spender: chainConfigs[network].ICON_BTS_CORE,
      amount: IconConverter.toHex(convertToLoopUnit(value)),
    },
  };

  window[txPayload] = tx;
  window[signingActions.globalName] = signingActions.approve;
  signTx(transaction, options);
  return { transaction, options };
};

/**
 * Send non-native token which was approved
 */
export const sendNonNativeCoin = () => {
  const { coinName, value, to, network } = window[txPayload];
  const { NETWORK_ADDRESS, ICON_BTS_CORE } = chainConfigs[network];

  const transaction = {
    to: ICON_BTS_CORE,
  };

  const options = {
    builder: new CallTransactionBuilder(),
    method: 'transfer',
    params: {
      _to: `btp://${NETWORK_ADDRESS}/${to}`,
      _value: IconConverter.toHex(convertToLoopUnit(value)),
      _coinName: formatSymbol(coinName),
    },
  };

  window[signingActions.globalName] = signingActions.transfer;
  signTx(transaction, options);
  return { transaction, options };
};

export const sendNativeCoin = (tx) => {
  const { value, to, network } = tx;
  const transaction = {
    to: chainConfigs[network]?.ICON_BTS_CORE,
    value,
  };

  const options = {
    builder: new CallTransactionBuilder(),
    method: 'transferNativeCoin',
    params: {
      _to: `btp://${chainConfigs[network]?.NETWORK_ADDRESS}/${to}`,
    },
  };

  signTx(transaction, options);
  return { transaction, options };
};

/**
 * Claim token which was failed to refunded automatically
 * @param {object} payload
 */
export const reclaim = async ({ coinName, value }) => {
  const transaction = {
    to: getICONBSHAddressforEachChain(coinName),
  };

  const options = {
    builder: new CallTransactionBuilder(),
    method: 'reclaim',
    params: {
      _coinName: coinName,
      _value: IconConverter.toHex(convertToLoopUnit(value)),
    },
  };

  signTx(transaction, options);
};

/**
 * Request ICON wallet to sign a transaction
 * @param {object} transaction
 * @param {onject} options
 */
export const signTx = (transaction = {}, options = {}) => {
  const { from = localStorage.getItem(ADDRESS_LOCAL_STORAGE), to, value } = transaction;
  const { method, params, builder, nid, stepLimit, timestamp } = options;

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
    .stepLimit(IconConverter.toBigNumber(stepLimit || ICONchain.STEP_LIMIT))
    .nid(IconConverter.toBigNumber(nid || ICONchain.NETWORK_ADDRESS?.split('.')[0]))
    .nonce(IconConverter.toBigNumber(1))
    .version(IconConverter.toBigNumber(3))
    .timestamp(timestamp || new Date().getTime() * 1000);

  if (value) {
    tx = tx.value(convertToLoopUnit(value));
  }

  if (method) {
    tx = tx.method(method).params(params);
  }

  tx = tx.build();
  const rawTx = IconConverter.toRawTransaction(tx);
  window[rawTransaction] = rawTx;
  const transactionHash = serialize(rawTx);

  requestSigning(rawTx);
  return transactionHash;
};

/**
 * Returns BTP fee
 * @return {string} unit: 1/10000
 * ref: https://github.com/icon-project/btp/blob/iconloop/javascore/nativecoin/src/main/java/foundation/icon/btp/nativecoin/NativeCoinService.java#L40
 */
export const getBTPfee = async (symbol, toNetwork, currentNetwork, currentNetworkId) => {
  if (!symbol) return 0;

  const fee = await makeICXCall({
    to:
      currentNetwork === process.env.REACT_APP_CHAIN_ICON_CHAIN_NAME
        ? chainConfigs[toNetwork]?.ICON_BTS_CORE
        : chainConfigs[currentNetworkId].ICON_BTS_CORE,
    dataType: 'call',
    data: {
      method: 'feeRatio',
      params: {
        _name: formatSymbol(symbol),
      },
    },
  });

  return IconConverter.toNumber(convertToICX(fee.fixedFee));
};

/**
 * Get BSH address of non-native token
 * In ICON network, every non-native token has their own BSH address
 * @param {string} coinName Token's name, ex: ICX, DEV,
 * @returns {Promise<string>} BSH address corresponding to the coinName
 */
export const getBSHAddressOfCoinName = async (coinName) => {
  try {
    const payload = {
      dataType: 'call',
      to: getICONBSHAddressforEachChain(coinName),
      data: {
        method: 'coinId',
        params: {
          _coinName: formatSymbol(coinName),
        },
      },
    };
    const address = await makeICXCall(payload);
    return address;
  } catch (err) {
    console.log('getBSHAddressOfCoinName err', err);
  }
};

/**
 * Get balance of non-native token
 * @param {object} payload
 * @returns {string} non-native token balance or refundable balance in a user-friendly format
 */
export const getBalanceOf = async ({ address, refundable = false, symbol }) => {
  try {
    const payload = {
      dataType: 'call',
      data: {
        method: 'balanceOf',
        params: {
          _owner: address,
        },
      },
    };

    if (refundable) {
      // TODO: Hard-coded because we haven't had the way how to display ICX refundable balance for multi-chains
      if (symbol === 'ICX') return 0;

      payload.to = getICONBSHAddressforEachChain(symbol);
      payload.data.params._coinName = formatSymbol(symbol);
    } else {
      const bshAddressToken = await getBSHAddressOfCoinName(symbol);
      if (!bshAddressToken) throw new Error('BSH address not found');
      payload.to = bshAddressToken;
    }

    const balance = await makeICXCall(payload);

    return refundable
      ? convertToICX(balance.refundable)
      : roundNumber(ethers.utils.formatEther(balance), 6);
  } catch (err) {
    console.log('getBalanceOf err', err);
    return 0;
  }
};

export const approveIRC2 = async (tx) => {
  const { value, network, coinName } = tx;
  const bshAddress = await getBSHAddressOfCoinName(coinName);
  const transaction = {
    to: bshAddress,
  };

  const options = {
    builder: new CallTransactionBuilder(),
    method: 'transfer',
    params: {
      _to: chainConfigs[network].ICON_BTS_CORE,
      _value: IconConverter.toHex(convertToLoopUnit(value)),
    },
  };

  window[txPayload] = tx;
  window[signingActions.globalName] = signingActions.approveIRC2;

  signTx(transaction, options);
  return { transaction, options };
};
