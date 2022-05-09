import { sendNativeCoin, setApproveForSendNonNativeCoin } from './ICONServices';
import { signingActions } from 'connectors/constants';

export const transfer = (tx, isSendingNativeCoin) => {
  window[signingActions.globalName] = signingActions.transfer;

  if (isSendingNativeCoin) {
    sendNativeCoin(tx);
  } else {
    setApproveForSendNonNativeCoin(tx);
  }
};
