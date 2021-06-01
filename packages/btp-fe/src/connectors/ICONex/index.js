import { getBalance, sendTransaction } from './iconService';
import { requestHasAddress } from './events';

import store from '../../store';
import { wallets } from '../../utils/constants';
import { TYPES, ADDRESS_LOCAL_STORAGE, currentICONexNetwork } from '../constants';

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

    case TYPES.RESPONSE_SIGNING:
      await sendTransaction(payload);

      store.dispatch.modal.openModal({
        icon: 'checkIcon',
        desc: 'Your transaction was submitted successfully.',
        button: {
          text: 'Continue transfer',
        },
      });

      // latency time fo fetching new balance
      setTimeout(async () => {
        var balance = await getBalance(address);
        setBalance(+balance);
      }, 2000);
      break;

    case TYPES.CANCEL_SIGNING:
      store.dispatch.modal.openModal({
        icon: 'exclamationPointIcon',
        desc: 'Rejected signing transaction.',
      });
      break;

    case 'CANCEL':
      store.dispatch.account.setAccountInfo({
        cancelConfirmation: true,
      });
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
    currentNetwork: currentICONexNetwork.name,
  });
};

const setBalance = (balance) => {
  store.dispatch.account.setAccountInfo({
    balance,
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
