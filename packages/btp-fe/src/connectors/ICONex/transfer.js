import { sendNativeCoin, setApproveForSendNonNativeCoin } from './ICONServices';
import { signingActions } from 'connectors/constants';

export const transfer = (tx, isSendingNativeCoin, token, network) => {
  window[signingActions.globalName] = signingActions.transfer;

  if (isSendingNativeCoin) {
    sendNativeCoin(tx, network);
  } else {
    setApproveForSendNonNativeCoin(tx, network);
  }
};
