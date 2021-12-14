import store from 'store';
import { wallets, getPairedNetwork, pairedNetworks } from 'utils/constants';

import * as ICONServices from 'connectors/ICONex/ICONService';
import * as BSCServices from 'connectors/MetaMask/services/BSCServices';
import * as MoonbeamServices from 'connectors/MetaMask/services/MoonbeamServices';
import * as NEARServices from 'connectors/NEARWallet';

export const getCurrentTransferService = () => (targetWallet) => {
  const { wallet } = store.getState().account;
  if (!wallet && !targetWallet) throw new Error('Missing wallet');

  const currentPairedNetworks = getPairedNetwork();
  if (!currentPairedNetworks) throw new Error('Missing chains');

  switch (wallet || targetWallet) {
    case wallets.metamask:
      switch (currentPairedNetworks) {
        case pairedNetworks['ICON-Moonbeam']:
          return MoonbeamServices;

        case pairedNetworks['ICON-BSC']:
          return BSCServices;
      }
      break;
    case wallets.iconex:
      return ICONServices;
    case wallets.near:
      return NEARServices;

    default:
      console.log('No matching wallet service');
      break;
  }

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
