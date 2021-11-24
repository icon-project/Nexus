import { ethers } from 'ethers';

import {
  ADDRESS_LOCAL_STORAGE,
  MOON_BEAM_NODE,
  getCurrentICONexNetwork,
} from 'connectors/constants';

import { convertToICX } from 'connectors/ICONex/utils';
import { toChecksumAddress } from '../utils';
import { isICONAndBSHPaired } from 'utils/constants';
import { roundNumber } from 'utils/app';

import { EthereumInstance } from 'connectors/MetaMask';

export const getBalanceOf = async ({ address, refundable = false, symbol = 'ICX' }) => {
  try {
    const balance = isICONAndBSHPaired()
      ? await EthereumInstance.contract_BSC.getBalanceOf(address, symbol)
      : await EthereumInstance.contract.getBalanceOf(address, symbol);
    console.log('🚀 ~ file: index.js ~ line 114 ~ Ethereum ~ getBalanceOf ~ balance', balance);
    return refundable
      ? convertToICX(balance._refundableBalance._hex)
      : roundNumber(convertToICX(balance[0]._hex), 6);
  } catch (err) {
    console.log('Err: ', err);
    return 0;
  }
};

export const setApprovalForAll = async () => {
  const data = EthereumInstance.MB_BSH_ABI.encodeFunctionData('setApprovalForAll', [
    MOON_BEAM_NODE.BSHCore,
    '0x1',
  ]);

  await EthereumInstance.sendTransaction({
    from: EthereumInstance.ethereum.selectedAddress,
    to: MOON_BEAM_NODE.BSHCore,
    gas: MOON_BEAM_NODE.gasLimit,
    data,
  });
};

export const reclaim = async ({ coinName, value }) => {
  const data = EthereumInstance.MB_BSH_ABI.encodeFunctionData('reclaim', [coinName, value]);

  await EthereumInstance.sendTransaction({
    from: EthereumInstance.ethereum.selectedAddress,
    to: MOON_BEAM_NODE.BSHCore,
    gas: MOON_BEAM_NODE.gasLimit,
    data,
  });
};

export const isApprovedForAll = async (address) => {
  try {
    const result = await EthereumInstance.contract.isApprovedForAll(
      address || localStorage.getItem(ADDRESS_LOCAL_STORAGE),
      MOON_BEAM_NODE.BSHCore,
    );
    return result;
  } catch (err) {
    console.log('Err: ', err);
  }
};

export const transfer = async (tx, sendNativeCoin) => {
  // https://docs.metamask.io/guide/sending-transactions.html#example
  const value = ethers.utils.parseEther(tx.value)._hex;
  const { to } = tx;
  let txParams = {
    from: toChecksumAddress(EthereumInstance.ethereum.selectedAddress),
    value,
  };

  let data = null;
  if (sendNativeCoin) {
    data = EthereumInstance.MB_BSH_ABI.encodeFunctionData('transferNativeCoin', [
      `btp://${getCurrentICONexNetwork().networkAddress}/${to}`,
    ]);
  } else {
    data = EthereumInstance.MB_BSH_ABI.encodeFunctionData('transfer', [
      'ICX',
      value,
      `btp://${getCurrentICONexNetwork().networkAddress}/${to}`,
    ]);

    delete txParams.value;
  }

  txParams = {
    ...txParams,
    to: MOON_BEAM_NODE.BSHCore,
    gas: MOON_BEAM_NODE.gasLimit,
    data,
  };

  await EthereumInstance.sendTransaction(txParams);
};
