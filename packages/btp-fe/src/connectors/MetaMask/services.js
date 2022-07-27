import { ethers } from 'ethers';

import { signingActions, rawTransaction, getCurrentChain } from 'connectors/constants';

import { convertToICX } from 'connectors/ICONex/utils';
import { chainConfigs } from 'connectors/chainConfigs';
import { toChecksumAddress } from './utils';
import { roundNumber } from 'utils/app';
import { EthereumInstance } from 'connectors/MetaMask';
import { ABI } from './ABI';
import { ABIOfToken } from './ABIOfToken';

const ICONchain = chainConfigs.ICON || {};

export const getBalanceOf = async ({ address, refundable = false, symbol = 'ICX' }) => {
  try {
    let balance = 0;

    if (refundable) {
      balance = await new ethers.Contract(
        getCurrentChain().BTS_CORE,
        ABI,
        EthereumInstance.provider,
      ).balanceOf(address, symbol);
    } else {
      balance = await new ethers.Contract(
        getCurrentChain()[symbol],
        ABIOfToken,
        EthereumInstance.provider,
      ).balanceOf(address);
    }

    return roundNumber(
      convertToICX(refundable ? balance._refundableBalance._hex : balance._hex || balance[0]._hex),
      6,
    );
  } catch (err) {
    console.log('Err: ', err);
    return 0;
  }
};

export const reclaim = async ({ coinName, value }) => {
  const { BSH_CORE, GAS_LIMIT } = getCurrentChain();

  const data = EthereumInstance.ABI.encodeFunctionData('reclaim', [coinName, value]);

  await EthereumInstance.sendTransaction({
    from: EthereumInstance.ethereum.selectedAddress,
    to: BSH_CORE,
    gas: GAS_LIMIT,
    data,
  });
};

export const transfer = async (tx, sendNativeCoin, token) => {
  const { BTS_CORE, GAS_LIMIT } = getCurrentChain();

  // https://docs.metamask.io/guide/sending-transactions.html#example
  const value = ethers.utils.parseEther(tx.value)._hex;
  const { to } = tx;
  let txParams = {
    from: toChecksumAddress(EthereumInstance.ethereum.selectedAddress),
    value,
  };

  let data = null;
  if (sendNativeCoin) {
    window[signingActions.globalName] = signingActions.transfer;

    data = EthereumInstance.ABI.encodeFunctionData('transferNativeCoin', [
      `btp://${ICONchain.NETWORK_ADDRESS}/${to}`,
    ]);
    txParams = {
      ...txParams,
      to: BTS_CORE,
    };
  } else {
    window[rawTransaction] = tx;
    window[signingActions.globalName] = signingActions.approve;

    data = EthereumInstance.ABI.encodeFunctionData('approve', [BTS_CORE, value]);

    txParams = {
      ...txParams,
      to: getCurrentChain()[token],
    };
    delete txParams.value;
  }

  txParams = {
    ...txParams,
    gas: GAS_LIMIT,
    data,
  };

  await EthereumInstance.sendTransaction(txParams);
  return txParams;
};

export const sendNoneNativeCoin = async () => {
  const { BTS_CORE, GAS_LIMIT } = getCurrentChain();

  const { value, to, coinName } = window[rawTransaction];
  const hexValue = ethers.utils.parseEther(value)._hex;

  const data = EthereumInstance.ABI.encodeFunctionData('transfer', [
    coinName,
    hexValue,
    `btp://${ICONchain.NETWORK_ADDRESS}/${to}`,
  ]);

  window[signingActions.globalName] = signingActions.transfer;
  const params = {
    from: EthereumInstance.ethereum.selectedAddress,
    to: BTS_CORE,
    gas: GAS_LIMIT,
    data,
  };

  await EthereumInstance.sendTransaction(params);
  return params;
};
