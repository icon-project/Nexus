import { ethers } from 'ethers';

import { roundNumber } from 'utils/app';
import { MOON_BEAM_NODE, BSC_NODE, getCurrentICONexNetwork } from 'connectors/constants';
import { convertToICX } from 'connectors/ICONex/utils';
import { toChecksumAddress } from 'connectors/MetaMask/utils';
import { EthereumInstance } from 'connectors/MetaMask';

// get ETH balance (ERC20 contract)
export const getBalanceOf = async ({ address }) => {
  const balance = await EthereumInstance.contractBEP20TKN_BSC.balanceOf(address);
  return roundNumber(convertToICX(balance._hex), 6);
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

export const approve = async () => {
  const data = EthereumInstance.BSC_BSH_ABI.encodeFunctionData('approve', [
    BSC_NODE.tokenBSHProxy,
    ethers.utils.parseEther('0.1')._hex,
  ]);

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
    approve();
  }
};

export const transferETHfromBSC = async () => {
  const data = EthereumInstance.BSC_BSH_ABI.encodeFunctionData('transfer', [
    'ETH',
    ethers.utils.parseEther('0.1')._hex,
    `btp://${getCurrentICONexNetwork().networkAddress}/hx2ad1356e017a25d53cb7dc256d01aadc619d45d7`,
  ]);

  await EthereumInstance.sendTransaction({
    from: EthereumInstance.ethereum.selectedAddress,
    to: BSC_NODE.tokenBSHProxy,
    gas: MOON_BEAM_NODE.gasLimit,
    data,
  });
};
