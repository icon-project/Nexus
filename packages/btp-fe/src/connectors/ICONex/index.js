import { getBalance, sendTransaction } from './iconService';
import { requestHasAddress } from './events';

import store from '../../store';
import { wallets } from '../../utils/constants';
import { TYPES, ADDRESS_LOCAL_STORAGE, currentICONexNetwork, signingActions } from '../constants';

const { modal, account } = store.dispatch;

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
      try {
        await sendTransaction(payload);

        switch (window[signingActions.globalName]) {
          case signingActions.bid:
            modal.openModal({
              icon: 'checkIcon',
              desc: 'Congratulation! Your bid successfully placed.',
              button: {
                text: 'Continue bidding',
                onClick: () => modal.setDisplay(false),
              },
            });
            break;

          case signingActions.transfer:
            modal.openModal({
              icon: 'checkIcon',
              desc: 'Your transaction was submitted successfully.',
              button: {
                text: 'Continue transfer',
                onClick: () => modal.setDisplay(false),
              },
            });

            // latency time fo fetching new balance
            setTimeout(async () => {
              var balance = await getBalance(address);
              setBalance(+balance);
            }, 2000);
            break;
          default:
            break;
        }
      } catch (err) {
        switch (window[signingActions.globalName]) {
          case signingActions.bid:
            modal.openModal({
              icon: 'xIcon',
              button: {
                text: 'Try again',
                onClick: () => modal.setDisplay(false),
              },
            });
            break;
          case signingActions.transfer:
            modal.openModal({
              icon: 'xIcon',
              desc: 'Your transaction has failed. Please go back and try again.',
              button: {
                text: 'Back to transfer',
                onClick: () => modal.setDisplay(false),
              },
            });
            break;

          default:
            break;
        }
      }
      break;
    case TYPES.CANCEL_SIGNING:
      modal.openModal({
        icon: 'exclamationPointIcon',
        desc: 'Transaction rejected.',
        button: {
          text: 'Dissmiss',
          onClick: () => modal.setDisplay(false),
        },
      });
      break;

    case 'CANCEL':
      account.setAccountInfo({
        cancelConfirmation: true,
      });
      break;
    default:
      break;
  }
};

const getAccountInfo = async (address) => {
  const balance = +(await getBalance(address));
  account.setAccountInfo({
    address,
    balance,
    wallet: wallets.iconex,
    unit: 'ICX',
    currentNetwork: currentICONexNetwork.name,
  });
};

const setBalance = (balance) => {
  account.setAccountInfo({
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
