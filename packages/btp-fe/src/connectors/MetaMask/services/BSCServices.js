import { ethers } from 'ethers';

import { roundNumber } from 'utils/app';
import { MOON_BEAM_NODE, BSC_NODE, getCurrentICONexNetwork } from 'connectors/constants';
import { convertToICX } from 'connectors/ICONex/utils';
import { toChecksumAddress } from 'connectors/MetaMask/utils';
import { EthereumInstance } from 'connectors/MetaMask';

export const getBalanceOf = () => {
  console.log('TODO');
  return Promise.resolve(true);
};

export const transferNativeCoin = async (tx = {}) => {
  const value = ethers.utils.parseEther(tx.value || '1')._hex;
  const { to } = tx;

  const data = EthereumInstance.BSC_BSH_ABI.encodeFunctionData('transferNativeCoin', [
    `btp://${getCurrentICONexNetwork().networkAddress}/${
      to || 'hxcf3af6a05c8f1d6a8eb9f53fe555f4fdf4316262'
    }`,
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

export const getETHBalance = async () => {
  try {
    const balance = await EthereumInstance.contractBEP20TKN_BSC.balanceOf(
      '0xEbCBd4a934a68510E21ba25b2A827138248A63E5', // Bob address
    );
    console.log(
      '🚀 ~ file: index.js ~ line 323 ~ Ethereum ~ getETHBalance ~ balance',
      roundNumber(convertToICX(balance._hex), 6),
    );
  } catch (err) {
    console.log('Err: ', err);
    return 0;
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
