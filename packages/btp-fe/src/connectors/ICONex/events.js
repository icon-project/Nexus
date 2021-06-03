import { TYPES } from '../constants';

const createICONexEvent = (type, payload) => {
  const event = new CustomEvent('ICONEX_RELAY_REQUEST', { detail: { type, payload } });
  window.dispatchEvent(event);
};

const requestHasAccount = () => {
  createICONexEvent(TYPES.REQUEST_HAS_ACCOUNT);
};

export const requestAddress = () => {
  requestHasAccount();

  return new Promise(function (resolve) {
    setTimeout(() => {
      if (window.hasICONexAccount) {
        createICONexEvent(TYPES.REQUEST_ADDRESS);
        resolve(true);
      } else {
        // handle if the ICONex extension is not installed
        // https://github.com/icon-project/icon-sdk-js/issues/12#issuecomment-781446159
        window.open(
          'https://chrome.google.com/webstore/detail/iconex/flpiciilemghbmfalicajoolhkkenfel',
        );

        resolve(false);
      }
    }, 2000);
  });
};

export const requestHasAddress = (address) => {
  createICONexEvent(TYPES.REQUEST_HAS_ADDRESS, address);
};

export const requestSigning = (transaction) => {
  createICONexEvent(TYPES.REQUEST_SIGNING, transaction);
};
