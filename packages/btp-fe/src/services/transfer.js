import store from 'store';
import {
  transfer,
  isApprovedForAll,
  setApprovalForAll,
  getBalanceOf,
  getBTPfee,
} from 'connectors/ICONex/iconService';
import { EthereumInstance } from 'connectors/MetaMask';
import { wallets } from 'utils/constants';

const getCurrentTransferService = () => {
  const { wallet } = store.getState().account;
  const iconServices = { transfer, isApprovedForAll, setApprovalForAll, getBalanceOf, getBTPfee };

  switch (wallet) {
    case wallets.iconex:
      return iconServices;

    default:
      return EthereumInstance;
  }
};

const services = getCurrentTransferService();

export { services };
