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

const getCurrentTransferService = () => () => {
  const { wallet } = store.getState().account;
  const iconServices = { transfer, isApprovedForAll, setApprovalForAll, getBalanceOf, reclaim };

  switch (wallet) {
    case wallets.iconex:
      return iconServices;

    default:
      return EthereumInstance;
  }
};

const getService = getCurrentTransferService();

export { getService };
