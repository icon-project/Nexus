import store from 'store';
import {
  transfer,
  isApprovedForAll,
  setApprovalForAll,
  getBalanceOf,
} from 'connectors/ICONex/iconService';
import { EthereumInstance } from 'connectors/MetaMask';
import { wallets } from 'utils/constants';

const getCurrentTransferService = () => (targetWallet) => {
  const { wallet } = store.getState().account;
  if (!wallet && !targetWallet) throw new Error('Missing wallet');

  const iconServices = { transfer, isApprovedForAll, setApprovalForAll, getBalanceOf };

  switch (wallet || targetWallet) {
    case wallets.iconex:
      return iconServices;

    default:
      return EthereumInstance;
  }
};

const getService = getCurrentTransferService();

export { getService };
