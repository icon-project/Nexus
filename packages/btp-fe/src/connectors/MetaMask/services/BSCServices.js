import { ethers } from 'ethers';

import { roundNumber } from 'utils/app';
import {
  MOON_BEAM_NODE,
  BSC_NODE,
  getCurrentICONexNetwork,
  signingActions,
  rawTransaction,
} from 'connectors/constants';
import { convertToICX } from 'connectors/ICONex/utils';
import { toChecksumAddress } from 'connectors/MetaMask/utils';
import { EthereumInstance } from 'connectors/MetaMask';

export const getBalanceOf = async ({ address, symbol }) => {
  let balance = 0;

  // get ETH balance (ERC20 contract)
  if (symbol === 'ETH') {
    balance = await EthereumInstance.contractBEP20TKN_BSC.balanceOf(address);
  } else {
    balance = await EthereumInstance.contract_BSC.getBalanceOf(address, symbol);
  }

  return roundNumber(convertToICX(balance._hex || balance[0]._hex), 6);
};

export const transferNativeCoin = async (tx = {}) => {
  const value = ethers.utils.parseEther(tx.value || '1')._hex;

  const data = EthereumInstance.BSC_BSH_ABI.encodeFunctionData('transferNativeCoin', [
    `btp://${getCurrentICONexNetwork().networkAddress}/${tx.to}`,
  ]);

  const txParams = {
    from: toChecksumAddress(EthereumInstance.ethereum.selectedAddress),
    value,
    gas: MOON_BEAM_NODE.gasLimit,
    data,
  };

  await EthereumInstance.sendTransaction(txParams);
};

export const approve = async (tx) => {
  const data = EthereumInstance.BSC_BSH_ABI.encodeFunctionData('approve', [
    BSC_NODE.tokenBSHProxy,
    ethers.utils.parseEther(tx.value)._hex,
  ]);

  window[rawTransaction] = tx;
  window[signingActions.globalName] = signingActions.deposit;

  await EthereumInstance.sendTransaction({
    from: EthereumInstance.ethereum.selectedAddress,
    to: BSC_NODE.BEP20TKN,
    data,
  });
};

export const transfer = (tx, isSendingNativeCoin) => {
  if (isSendingNativeCoin) {
    transferNativeCoin(tx);
  } else {
    approve(tx);
  }
};

export const sendNoneNativeCoinBSC = async () => {
  const data = EthereumInstance.BSC_BSH_ABI.encodeFunctionData('transfer', [
    'ETH',
    ethers.utils.parseEther(window[rawTransaction].value)._hex,
    `btp://${getCurrentICONexNetwork().networkAddress}/${window[rawTransaction].to}`,
  ]);

  window[signingActions.globalName] = signingActions.transfer;
  await EthereumInstance.sendTransaction({
    from: EthereumInstance.ethereum.selectedAddress,
    to: BSC_NODE.tokenBSHProxy,
    gas: MOON_BEAM_NODE.gasLimit,
    data,
  });
};
