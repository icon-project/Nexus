import { getBalance } from './iconService';
import { requestHasAddress } from './events';

import store from '../../store';
import { wallets } from '../../utils/constants';
import { TYPES, ADDRESS_LOCAL_STORAGE } from '../constants';

const eventHandler = async (event) => {
  const { type, payload = {} } = event.detail;
  const address = localStorage.getItem(ADDRESS_LOCAL_STORAGE);

  console.info('%cICONex event', 'color: green;', event.detail);

  switch (type) {
    // request for wallet address confirm
    case TYPES.RESPONSE_ADDRESS:
      getAccountInfo(payload);
      localStorage.setItem(ADDRESS_LOCAL_STORAGE, payload);
      break;

    // check if the wallet includes the current address
    case TYPES.RESPONSE_HAS_ADDRESS:
      if (payload.hasAddress) {
        getAccountInfo(address);
      }
      break;

    case TYPES.RESPONSE_HAS_ACCOUNT:
      window.hasICONexAccount = true;
      break;
    default:
      break;
  }
};

const getAccountInfo = async (address) => {
  const balance = +(await getBalance(address));
  store.dispatch.account.setAccountInfo({
    address,
    balance,
    wallet: wallets.iconex,
    unit: 'ICX',
  });
};

export const addICONexListener = () => {
  window.addEventListener('ICONEX_RELAY_RESPONSE', eventHandler);

  const address = localStorage.getItem(ADDRESS_LOCAL_STORAGE);
  if (address) {
    setTimeout(() => {
      requestHasAddress(address);
    }, 2000);
  }
};
