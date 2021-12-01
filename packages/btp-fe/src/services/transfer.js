import store from 'store';
import {
  transfer,
  isApprovedForAll,
  setApprovalForAll,
  getBalanceOf,
  reclaim,
} from 'connectors/ICONex/iconService';
import { wallets, getPairedNetwork, pairedNetworks } from 'utils/constants';
import * as BSCServices from 'connectors/MetaMask/services/BSCServices';
import * as MoonbeamServices from 'connectors/MetaMask/services/BSCServices';

const getCurrentTransferService = () => (targetWallet) => {
  const { wallet } = store.getState().account;
  if (!wallet && !targetWallet) throw new Error('Missing wallet');

  const iconServices = { transfer, isApprovedForAll, setApprovalForAll, getBalanceOf, reclaim };

  const currentPairedNetworks = getPairedNetwork();
  if ((wallet || targetWallet) === wallets.metamask) {
    switch (currentPairedNetworks) {
      case pairedNetworks['ICON-BSC']:
        return BSCServices;

      default:
        return MoonbeamServices;
    }
  } else {
    return iconServices;
  }
};

const getService = getCurrentTransferService();

export { getService };
