import store from 'store';
import {
  transfer,
  isApprovedForAll,
  setApprovalForAll,
  getBalanceOf,
  reclaim,
} from 'connectors/ICONex/iconService';
import { EthereumInstance } from 'connectors/MetaMask';
import { wallets } from 'utils/constants';

const getCurrentTransferService = () => (targetWallet) => {
  const { wallet } = store.getState().account;
  if (!wallet && !targetWallet) throw new Error('Missing wallet');

  const iconServices = { transfer, isApprovedForAll, setApprovalForAll, getBalanceOf, reclaim };

  switch (wallet || targetWallet) {
    case wallets.metamask:
      return EthereumInstance;
    default:
      return iconServices;
  }
};

const getService = getCurrentTransferService();

export { getService };
