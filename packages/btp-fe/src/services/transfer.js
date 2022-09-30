import store from 'store';
import { wallets } from 'utils/constants';

import * as ICONServices from 'connectors/ICONex/ICONServices';
import * as MoonbeamServices from 'connectors/MetaMask/services';
import * as NEARServices from 'connectors/NearWallet';

export const getCurrentTransferService = () => (curentWallet, currentNetwork) => {
  const { wallet, currentNetwork: network } = store.getState().account;
  if (!wallet && !curentWallet) throw new Error('Missing wallet');
  if (!network && !currentNetwork) throw new Error('Missing network');

  switch (wallet || curentWallet) {
    case wallets.metamask:
      return MoonbeamServices;

    case wallets.iconex:
    case wallets.hana:
      return ICONServices;

    case wallets.near:
      return NEARServices;

    default:
      console.log('No matching wallet service');
      break;
  }
};

const getService = getCurrentTransferService();

export { getService };
