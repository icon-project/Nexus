import store from 'store';
import { wallets, getPairedNetwork, pairedNetworks } from 'utils/constants';

import * as ICONServices from 'connectors/ICONex/iconService';
import * as BSCServices from 'connectors/MetaMask/services/BSCServices';
import * as MoonbeamServices from 'connectors/MetaMask/services/MoonbeamServices';

export const getCurrentTransferService = () => (targetWallet) => {
  const { wallet } = store.getState().account;
  if (!wallet && !targetWallet) throw new Error('Missing wallet');

  const currentPairedNetworks = getPairedNetwork();
  if (!currentPairedNetworks) throw new Error('Missing chains');

  if ((wallet || targetWallet) === wallets.metamask) {
    switch (currentPairedNetworks) {
      case pairedNetworks['ICON-Moonbeam']:
        return MoonbeamServices;

      case pairedNetworks['ICON-BSC']:
        return BSCServices;
    }
  } else {
    return ICONServices;
  }
};

const getService = getCurrentTransferService();

export { getService };
