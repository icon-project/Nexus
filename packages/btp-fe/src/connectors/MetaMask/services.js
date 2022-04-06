import { ethers } from 'ethers';

import { signingActions, rawTransaction, getCurrentChain } from 'connectors/constants';

import { convertToICX } from 'connectors/ICONex/utils';
import { chainConfigs } from 'connectors/chainConfigs';
import { toChecksumAddress } from './utils';
import { roundNumber } from 'utils/app';
import { EthereumInstance } from 'connectors/MetaMask';

export const serviceName = 'TODO';
const ICONchain = chainConfigs.ICON || {};

export const getBalanceOf = async ({ address, refundable = false, symbol = 'ICX' }) => {
  try {
    const balance = await EthereumInstance.contract.getBalanceOf(address, symbol);
    return refundable
      ? convertToICX(balance._refundableBalance._hex)
      : roundNumber(convertToICX(balance[0]._hex), 6);
  } catch (err) {
    console.log('Err: ', err);
    return 0;
  }
};

export const reclaim = async ({ coinName, value }) => {
  const data = EthereumInstance.ABI.encodeFunctionData('reclaim', [coinName, value]);

  await EthereumInstance.sendTransaction({
    from: EthereumInstance.ethereum.selectedAddress,
    to: getCurrentChain().BSH_CORE,
    gas: getCurrentChain().GAS_LIMIT,
    data,
  });
};

export const transfer = async (tx, sendNativeCoin, token) => {
  // https://docs.metamask.io/guide/sending-transactions.html#example
  const value = ethers.utils.parseEther(tx.value)._hex;
  const { to } = tx;
  let txParams = {
    from: toChecksumAddress(EthereumInstance.ethereum.selectedAddress),
    value,
  };

  let data = null;
  if (sendNativeCoin) {
    data = EthereumInstance.ABI.encodeFunctionData('transferNativeCoin', [
      `btp://${ICONchain.NETWORK_ADDRESS}/${to}`,
    ]);
    txParams = {
      ...txParams,
      to: getCurrentChain().BSH_CORE,
    };
  } else {
    window[rawTransaction] = tx;
    window[signingActions.globalName] = signingActions.approve;
    data = EthereumInstance.ABI.encodeFunctionData('approve', [getCurrentChain().BSH_CORE, value]);
    txParams = {
      ...txParams,
      to: getCurrentChain()['BSH_' + token],
    };
    delete txParams.value;
  }

  txParams = {
    ...txParams,
    gas: getCurrentChain().GAS_LIMIT,
    data,
  };

  await EthereumInstance.sendTransaction(txParams);
};

export const sendNoneNativeCoin = async () => {
  const data = EthereumInstance.ABI.encodeFunctionData('transfer', [
    'ICX',
    ethers.utils.parseEther(window[rawTransaction].value)._hex,
    `btp://${ICONchain.NETWORK_ADDRESS}/${window[rawTransaction].to}`,
  ]);

  window[signingActions.globalName] = signingActions.transfer;

  await EthereumInstance.sendTransaction({
    from: EthereumInstance.ethereum.selectedAddress,
    to: getCurrentChain().BSH_CORE,
    gas: getCurrentChain().GAS_LIMIT,
    data,
  });
};
